const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 160
const CANVAS_ZOOM = 2
const DRAW_COLOR = 'black'

function startPath(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.fillStyle = DRAW_COLOR
    context.fillRect(x * CANVAS_ZOOM, y * CANVAS_ZOOM, CANVAS_ZOOM, CANVAS_ZOOM)
}

function movePath(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number): void {
    const distance = Math.round(Math.sqrt(Math.pow(toX - fromX, 2.0) + Math.pow(toY - fromY, 2.0))) + 1

    context.fillStyle = DRAW_COLOR
    for (let i = 0; i <= distance; i++) {
        const rate = i / distance

        context.fillRect(
            (fromX + Math.round((toX - fromX) * rate)) * CANVAS_ZOOM,
            (fromY + Math.round((toY - fromY) * rate)) * CANVAS_ZOOM,
            CANVAS_ZOOM,
            CANVAS_ZOOM
        )
    }
}

function pointerToCanvasPosition(element: HTMLCanvasElement, event: PointerEvent): { x: number; y: number } {
    const rect = element.getBoundingClientRect()
    let x = Math.floor((event.clientX - rect.left) / CANVAS_ZOOM)
    let y = Math.floor((event.clientY - rect.top) / CANVAS_ZOOM)

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
        isDrawingPath = false
        let { x, y } = pointerToCanvasPosition(element, event)
        movePath(context, prevX, prevY, x, y)
    })
}

export default class {
    isDisplay: boolean = false

    constructor(element: HTMLCanvasElement) {
        element.setAttribute('width', (CANVAS_WIDTH * CANVAS_ZOOM).toString())
        element.setAttribute('height', (CANVAS_HEIGHT * CANVAS_ZOOM).toString())

        if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
            this.initializeWiiUEvents(element)
        } else {
            initializePointerEvents(element)
        }
    }

    private initializeWiiUEvents(element: HTMLCanvasElement): void {
        const context = element.getContext('2d')
        if (context === null) {
            throw "Couldn't get context. "
        }

        let isDrawingPath: boolean = false
        let prevX: number, prevY: number

        setInterval(() => {
            if (this.isDisplay) {
                const gamepad = (<any>window).wiiu.gamepad.update()

                if (gamepad.tpTouch) {
                    const rect = element.getBoundingClientRect()

                    const x = Math.floor((gamepad.contentX - rect.left) / CANVAS_ZOOM)
                    const y = Math.floor((gamepad.contentY - rect.top) / CANVAS_ZOOM)

                    if (isDrawingPath) {
                        movePath(context, prevX, prevY, x, y)
                        prevX = x
                        prevY = y
                    } else {
                        startPath(context, x, y)
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
