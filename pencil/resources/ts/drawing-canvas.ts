import * as Settings from './settings'

function getBrushPattern(brush: string): number[][] {
    if (!(brush in Settings.BRUSH_PATTERNS)) {
        throw `Couldn't get brush pattern: ${brush}. `
    }

    return (<any>Settings.BRUSH_PATTERNS)[brush]
}

function draw(context: CanvasRenderingContext2D, originX: number, originY: number, brushPattern: number[][]) {
    let y: number = originY - Math.floor(brushPattern.length / 2)
    brushPattern.forEach(column => {
        let x: number = originX - Math.floor(column.length / 2)
        column.forEach(pattern => {
            if (pattern) {
                context.fillRect(
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

function startPath(context: CanvasRenderingContext2D, x: number, y: number, brush: string): void {
    const brushPattern = getBrushPattern(brush)

    context.fillStyle = Settings.DRAW_COLOR
    draw(context, x, y, brushPattern)
}

function movePath(
    context: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    brush: string
): void {
    const brushPattern = getBrushPattern(brush)
    const distance = Math.round(Math.sqrt(Math.pow(toX - fromX, 2.0) + Math.pow(toY - fromY, 2.0))) + 1

    context.fillStyle = Settings.DRAW_COLOR
    for (let i = 0; i < distance; i++) {
        const rate = i / (distance - 1)

        draw(context, fromX + Math.round((toX - fromX) * rate), fromY + Math.round((toY - fromY) * rate), brushPattern)
    }
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
    private element: HTMLCanvasElement
    private context: CanvasRenderingContext2D

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

    private initializeWiiUEvents(): void {
        let isDrawingPath: boolean = false
        let prevX: number, prevY: number

        setInterval(() => {
            if (this.isDisplay) {
                const gamepad = (<any>window).wiiu.gamepad.update()

                if (gamepad.tpTouch) {
                    const rect = this.element.getBoundingClientRect()

                    const x = Math.floor((gamepad.contentX - rect.left) / Settings.CANVAS_ZOOM)
                    const y = Math.floor((gamepad.contentY - rect.top) / Settings.CANVAS_ZOOM)

                    if (isDrawingPath) {
                        movePath(this.context, prevX, prevY, x, y, this.brush)
                        prevX = x
                        prevY = y
                    } else {
                        startPath(this.context, x, y, this.brush)
                        prevX = x
                        prevY = y
                    }

                    isDrawingPath = true
                } else {
                    isDrawingPath = false
                }
            }
        }, 1)
    }

    private initializePointerEvents(): void {
        let isDrawingPath: boolean = false
        let prevX: number, prevY: number

        this.element.onpointerdown = (event: PointerEvent) => {
            isDrawingPath = true
            let { x, y } = pointerToCanvasPosition(this.element, event)
            startPath(this.context, x, y, this.brush)
            prevX = x
            prevY = y
        }
        this.element.onpointermove = (event: PointerEvent) => {
            if (isDrawingPath) {
                let { x, y } = pointerToCanvasPosition(this.element, event)
                movePath(this.context, prevX, prevY, x, y, this.brush)
                prevX = x
                prevY = y
            }
        }
        document.addEventListener('pointerup', (event: PointerEvent) => {
            if (isDrawingPath) {
                let { x, y } = pointerToCanvasPosition(this.element, event)
                movePath(this.context, prevX, prevY, x, y, this.brush)
            }
            isDrawingPath = false
        })
    }
}
