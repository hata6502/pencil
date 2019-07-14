import DrawingWindow from './drawing-window'
import DrawingDialog from './drawing-dialog'
import DrawingCanvas from './drawing-canvas'
import PencilButton from './pencil-button'
import StickCursor from './stick-cursor'
import PreviewCanvas from './preview-canvas'

const drawingWindow = new DrawingWindow(
    <HTMLDivElement>document.getElementById('drawing-window'),
    () => {
        drawingCanvas.isDisplay = true
    },
    () => {
        drawingCanvas.isDisplay = false
        previewCanvas.setDrawing(drawingCanvas.getDrawing())
    }
)

new DrawingDialog(<HTMLDivElement>document.getElementById('drawing-dialog'))

const drawingCanvas = new DrawingCanvas(<HTMLCanvasElement>document.getElementById('drawing-canvas'), () => {
    stickCursor.hide()
})

let pencilButtons: PencilButton[] = []
Array.prototype.forEach.call(
    document.getElementsByClassName('pencil-button'),
    (pencilButtonElement: HTMLButtonElement) => {
        const pencilButton = new PencilButton(pencilButtonElement, () => {
            pencilButtons.forEach((pencilButton: PencilButton) => {
                pencilButton.inactivate()
            })

            pencilButton.activate()
            drawingCanvas.brush = pencilButton.getBrush()
        })

        pencilButtons.push(pencilButton)
    }
)

const stickCursor = new StickCursor(<HTMLDivElement>document.getElementById('stick-cursor'), () => {
    drawingCanvas.draw(Math.floor(stickCursor.x), Math.floor(stickCursor.y))
})

const previewCanvas = new PreviewCanvas(<HTMLCanvasElement>document.getElementById('preview-canvas'), () => {
    drawingWindow.display()
})
