import * as Settings from './settings'

function startPath(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.fillStyle = Settings.DRAW_COLOR
    context.fillRect(x * Settings.CANVAS_ZOOM, y * Settings.CANVAS_ZOOM, Settings.CANVAS_ZOOM, Settings.CANVAS_ZOOM)
}

function movePath(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number): void {
    const distance = Math.round(Math.sqrt(Math.pow(toX - fromX, 2.0) + Math.pow(toY - fromY, 2.0))) + 1

    context.fillStyle = Settings.DRAW_COLOR
    for (let i = 0; i <= distance; i++) {
        const rate = i / distance

        context.fillRect(
            (fromX + Math.round((toX - fromX) * rate)) * Settings.CANVAS_ZOOM,
            (fromY + Math.round((toY - fromY) * rate)) * Settings.CANVAS_ZOOM,
            Settings.CANVAS_ZOOM,
            Settings.CANVAS_ZOOM
        )
    }
}

function pointerToCanvasPosition(element: HTMLCanvasElement, event: PointerEvent): { x: number; y: number } {
    const rect = element.getBoundingClientRect()
    let x = Math.floor((event.clientX - rect.left) / Settings.CANVAS_ZOOM)
    let y = Math.floor((event.clientY - rect.top) / Settings.CANVAS_ZOOM)

    return { x, y }
}

function initializePointerEvents(element: HTMLCanvasElement): void {
    const context = element.getContext('2d')
    if (context === null) {
        throw "Couldn't get context. "
    }

    let isDrawingPath: boolean = false
    let prevX: number, prevY: number

    element.onpointerdown = (event: PointerEvent) => {
        isDrawingPath = true
        let { x, y } = pointerToCanvasPosition(element, event)
        startPath(context, x, y)
        prevX = x
        prevY = y
    }
    element.onpointermove = (event: PointerEvent) => {
        if (isDrawingPath) {
            let { x, y } = pointerToCanvasPosition(element, event)
            movePath(context, prevX, prevY, x, y)
            prevX = x
            prevY = y
        }
    }
    document.addEventListener('pointerup', (event: PointerEvent) => {
        if (isDrawingPath) {
            let { x, y } = pointerToCanvasPosition(element, event)
            movePath(context, prevX, prevY, x, y)
        }
        isDrawingPath = false
    })
}

export default class {
    isDisplay: boolean = false
    private element: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    constructor(element: HTMLCanvasElement) {
        this.element = element
        const context = this.element.getContext('2d')
        if (context === null) {
            throw "Couldn't get context. "
        }
        this.context = context

        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString())
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString())

        if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
            this.initializeWiiUEvents()
        } else {
            initializePointerEvents(this.element)
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
                        movePath(this.context, prevX, prevY, x, y)
                        prevX = x
                        prevY = y
                    } else {
                        startPath(this.context, x, y)
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
}
