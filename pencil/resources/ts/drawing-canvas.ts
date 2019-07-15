import * as Settings from './settings'

function getBrushPattern(brush: string): number[][] {
    if (!(brush in Settings.BRUSH_PATTERNS)) {
        throw `Couldn't get brush pattern: ${brush}. `
    }

    return (<any>Settings.BRUSH_PATTERNS)[brush]
}

function pointerToCanvasPosition(element: HTMLCanvasElement, event: PointerEvent): { x: number; y: number } {
    const rect = element.getBoundingClientRect()
    let x = Math.floor((event.clientX - rect.left) / Settings.CANVAS_ZOOM)
    let y = Math.floor((event.clientY - rect.top) / Settings.CANVAS_ZOOM)

    return { x, y }
}

export default class {
    isDisplay: boolean = false
    brush: string
    color: string = Settings.DRAW_COLOR
    private element: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private history: ImageData[] = []
    ontouchdrawstart: (() => void) | undefined = undefined
    onchangehistory: ((index: number, length: number) => void) | undefined = undefined
    private historyIndex = -1

    constructor(element: HTMLCanvasElement) {
        this.element = element
        const context = this.element.getContext('2d')
        if (context === null) {
            throw "Couldn't get context. "
        }
        this.context = context

        this.brush = Settings.DRAW_BRUSH

        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString())
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString())

        this.backupCanvas()

        if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
            this.initializeWiiUEvents()
        } else {
            this.initializePointerEvents()
        }
    }

    getDrawing(): ImageData {
        return this.context.getImageData(
            0,
            0,
            Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM,
            Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM
        )
    }

    startDraw(isTouch: boolean): void {
        if (isTouch && this.ontouchdrawstart !== undefined) {
            this.ontouchdrawstart()
        }
    }

    draw(originX: number, originY: number) {
        const brushPattern = getBrushPattern(this.brush)

        this.context.fillStyle = this.color

        let y: number = originY - Math.floor(brushPattern.length / 2)
        brushPattern.forEach(column => {
            let x: number = originX - Math.floor(column.length / 2)
            column.forEach(pattern => {
                if (pattern) {
                    this.context.fillRect(
                        x * Settings.CANVAS_ZOOM,
                        y * Settings.CANVAS_ZOOM,
                        Settings.CANVAS_ZOOM,
                        Settings.CANVAS_ZOOM
                    )
                }

                x++
            })

            y++
        })
    }

    finishDraw(): void {
        this.backupCanvas()
    }

    private backupCanvas(): void {
        while (this.history.length - 1 > this.historyIndex) {
            this.history.pop()
        }

        this.history.push(this.getDrawing())

        while (this.history.length > Settings.HISTORY_MAX_LENGTH) {
            this.history.shift()
        }

        this.historyIndex = this.history.length - 1
        if (this.onchangehistory !== undefined) {
            this.onchangehistory(this.historyIndex, this.history.length)
        }
    }

    undo(): void {
        if (this.historyIndex <= 0) {
            return
        }

        const drawing = this.history[--this.historyIndex]
        if (drawing === undefined) {
            return
        }

        this.context.putImageData(drawing, 0, 0)

        if (this.onchangehistory !== undefined) {
            this.onchangehistory(this.historyIndex, this.history.length)
        }
    }

    redo(): void {
        if (this.historyIndex >= this.history.length - 1) {
            return
        }

        const drawing = this.history[++this.historyIndex]
        if (drawing === undefined) {
            return
        }

        this.context.putImageData(drawing, 0, 0)

        if (this.onchangehistory !== undefined) {
            this.onchangehistory(this.historyIndex, this.history.length)
        }
    }

    private initializeWiiUEvents(): void {
        let isDrawing: boolean = false
        let prevX: number | null, prevY: number

        setInterval(() => {
            if (this.isDisplay) {
                const gamepad = (<any>window).wiiu.gamepad.update()

                if (gamepad.tpTouch) {
                    const rect = this.element.getBoundingClientRect()

                    const x = Math.floor((gamepad.contentX - rect.left) / Settings.CANVAS_ZOOM)
                    const y = Math.floor((gamepad.contentY - rect.top) / Settings.CANVAS_ZOOM)

                    if (x >= 0 && x < Settings.CANVAS_WIDTH && y >= 0 && y < Settings.CANVAS_HEIGHT) {
                        if (!isDrawing) {
                            this.startDraw(true)
                        }

                        isDrawing = true
                    }

                    if (isDrawing) {
                        if (prevX !== null) {
                            this.drawLine(prevX, prevY, x, y)
                        } else {
                            this.draw(x, y)
                        }
                    }

                    prevX = x
                    prevY = y
                } else {
                    if (isDrawing) {
                        this.finishDraw()
                    }

                    isDrawing = false
                    prevX = null
                }
            }
        }, 16)
    }

    private initializePointerEvents(): void {
        let isDrawing: boolean = false
        let prevX: number, prevY: number

        this.element.onpointerdown = (event: PointerEvent) => {
            isDrawing = true
            let { x, y } = pointerToCanvasPosition(this.element, event)
            this.startDraw(true)
            this.draw(x, y)
            prevX = x
            prevY = y

            event.preventDefault()
        }
        this.element.onpointermove = (event: PointerEvent) => {
            if (isDrawing) {
                let { x, y } = pointerToCanvasPosition(this.element, event)
                this.drawLine(prevX, prevY, x, y)
                prevX = x
                prevY = y
            }

            event.preventDefault()
        }
        document.addEventListener('pointerup', (event: PointerEvent) => {
            if (isDrawing) {
                let { x, y } = pointerToCanvasPosition(this.element, event)
                this.drawLine(prevX, prevY, x, y)

                this.finishDraw()
            }
            isDrawing = false

            event.preventDefault()
        })
    }

    private drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
        const distance = Math.round(Math.sqrt(Math.pow(toX - fromX, 2.0) + Math.pow(toY - fromY, 2.0))) + 1

        for (let i = 0; i < distance; i++) {
            const rate = i / (distance - 1)

            this.draw(fromX + Math.round((toX - fromX) * rate), fromY + Math.round((toY - fromY) * rate))
        }
    }
}
