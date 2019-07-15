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
    private ondrawstart: () => void

    constructor(element: HTMLCanvasElement, ondrawstart: () => void) {
        this.element = element
        const context = this.element.getContext('2d')
        if (context === null) {
            throw "Couldn't get context. "
        }
        this.context = context
        this.ondrawstart = ondrawstart

        this.brush = Settings.DRAW_BRUSH

        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString())
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString())

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

    private drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
        const distance = Math.round(Math.sqrt(Math.pow(toX - fromX, 2.0) + Math.pow(toY - fromY, 2.0))) + 1

        for (let i = 0; i < distance; i++) {
            const rate = i / (distance - 1)

            this.draw(fromX + Math.round((toX - fromX) * rate), fromY + Math.round((toY - fromY) * rate))
        }
    }

    private initializeWiiUEvents(): void {
        let isDrawingPath: boolean = false
        let isOnDrawStartDispatched: boolean = false
        let prevX: number, prevY: number

        setInterval(() => {
            if (this.isDisplay) {
                const gamepad = (<any>window).wiiu.gamepad.update()

                if (gamepad.tpTouch) {
                    const rect = this.element.getBoundingClientRect()

                    const x = Math.floor((gamepad.contentX - rect.left) / Settings.CANVAS_ZOOM)
                    const y = Math.floor((gamepad.contentY - rect.top) / Settings.CANVAS_ZOOM)

                    if (isDrawingPath) {
                        this.drawLine(prevX, prevY, x, y)
                        prevX = x
                        prevY = y
                    } else {
                        this.draw(x, y)
                        prevX = x
                        prevY = y
                    }

                    if (
                        (isOnDrawStartDispatched =
                            x >= 0 &&
                            x < Settings.CANVAS_WIDTH &&
                            y >= 0 &&
                            y < Settings.CANVAS_HEIGHT &&
                            !isOnDrawStartDispatched)
                    ) {
                        this.ondrawstart()
                    }

                    isDrawingPath = true
                } else {
                    isDrawingPath = false
                    isOnDrawStartDispatched = false
                }
            }
        }, 16)
    }

    private initializePointerEvents(): void {
        let isDrawingPath: boolean = false
        let prevX: number, prevY: number

        this.element.onpointerdown = (event: PointerEvent) => {
            isDrawingPath = true
            let { x, y } = pointerToCanvasPosition(this.element, event)
            this.ondrawstart()
            this.draw(x, y)
            prevX = x
            prevY = y
        }
        this.element.onpointermove = (event: PointerEvent) => {
            if (isDrawingPath) {
                let { x, y } = pointerToCanvasPosition(this.element, event)
                this.drawLine(prevX, prevY, x, y)
                prevX = x
                prevY = y
            }
        }
        document.addEventListener('pointerup', (event: PointerEvent) => {
            if (isDrawingPath) {
                let { x, y } = pointerToCanvasPosition(this.element, event)
                this.drawLine(prevX, prevY, x, y)
            }
            isDrawingPath = false
        })
    }
}
