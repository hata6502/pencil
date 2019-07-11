const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 160
const CANVAS_ZOOM = 2
const DRAW_COLOR = 'black'

function startPath(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.fillStyle = DRAW_COLOR
    context.fillRect(x * CANVAS_ZOOM, y * CANVAS_ZOOM, CANVAS_ZOOM, CANVAS_ZOOM)
}

function movePath(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.fillStyle = DRAW_COLOR
    context.fillRect(x * CANVAS_ZOOM, y * CANVAS_ZOOM, CANVAS_ZOOM, CANVAS_ZOOM)
}

function finishPath(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.fillStyle = DRAW_COLOR
    context.fillRect(x * CANVAS_ZOOM, y * CANVAS_ZOOM, CANVAS_ZOOM, CANVAS_ZOOM)
}

function pointerToCanvasPosition(element: HTMLCanvasElement, event: PointerEvent): { x: number; y: number } {
    const rect = element.getBoundingClientRect()
    let x = Math.floor((event.clientX - rect.left) / CANVAS_ZOOM)
    let y = Math.floor((event.clientY - rect.top) / CANVAS_ZOOM)
    return { x, y }
}

function initializeWiiUEvents(element: HTMLCanvasElement): void {
    const context = element.getContext('2d')
    if (context === null) {
        throw "Couldn't get context. "
    }

    let isDrawingPath: boolean = false

    setInterval(() => {
        const gamepad = (<any>window).wiiu.gamepad.update()

        if (gamepad.tpTouch) {
            //const rect = element.getBoundingClientRect()

            if (isDrawingPath) {
                movePath(context, 0, 0)
            } else {
                startPath(context, 0, 0)
            }

            isDrawingPath = true
        } else {
            if (isDrawingPath) {
                finishPath(context, 0, 0)
            }

            isDrawingPath = false
        }
    }, 1)
}

function initializePointerEvents(element: HTMLCanvasElement): void {
    const context = element.getContext('2d')
    if (context === null) {
        throw "Couldn't get context. "
    }

    let isDrawingPath: boolean = false

    element.onpointerdown = (event: PointerEvent) => {
        isDrawingPath = true
        let { x, y } = pointerToCanvasPosition(element, event)
        startPath(context, x, y)
    }
    element.onpointermove = (event: PointerEvent) => {
        if (isDrawingPath) {
            let { x, y } = pointerToCanvasPosition(element, event)
            movePath(context, x, y)
        }
    }
    document.addEventListener('pointerup', (event: PointerEvent) => {
        isDrawingPath = false
        let { x, y } = pointerToCanvasPosition(element, event)
        finishPath(context, x, y)
    })
}

export default class {
    constructor(element: HTMLCanvasElement) {
        element.style.width = CANVAS_WIDTH * CANVAS_ZOOM + 'px'
        element.style.height = CANVAS_HEIGHT * CANVAS_ZOOM + 'px'

        if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
            initializeWiiUEvents(element)
        } else {
            initializePointerEvents(element)
        }
    }
}
