import DrawingWindow from './drawing-window'
import DrawingDialog from './drawing-dialog'
import DrawingCanvas from './drawing-canvas'
import PencilButton from './pencil-button'
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

const drawingCanvas = new DrawingCanvas(<HTMLCanvasElement>document.getElementById('drawing-canvas'))

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

const previewCanvas = new PreviewCanvas(<HTMLCanvasElement>document.getElementById('preview-canvas'), () => {
    drawingWindow.display()
})
