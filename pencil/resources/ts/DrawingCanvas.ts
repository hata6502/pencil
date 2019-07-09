const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 160

function startPath(x: number, y: number) {
    console.log(`start: ${x},${y}`)
}

function movePath(x: number, y: number) {
    console.log(`move: ${x},${y}`)
}

function finishPath(x: number, y: number) {
    console.log(`finish: ${x},${y}`)
}

export function render(element: HTMLCanvasElement): void {
    //const context = element.getContext('2d')

    element.style.width = CANVAS_WIDTH * 2 + 'px'
    element.style.height = CANVAS_HEIGHT * 2 + 'px'

    let isDrawingPath: boolean = false

    element.onpointerdown = (event: PointerEvent) => {
        isDrawingPath = true
        startPath(event.clientX, event.clientY)
    }
    element.onpointermove = (event: PointerEvent) => {
        if (isDrawingPath) {
            movePath(event.clientX, event.clientY)
        }
    }
    document.addEventListener('pointerup', (event: PointerEvent) => {
        isDrawingPath = false
        finishPath(event.clientX, event.clientY)
    })
}
