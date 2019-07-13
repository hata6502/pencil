import DrawingButton from './drawing-button'
import DrawingCanvas from './drawing-canvas'

const drawingWindow = document.getElementById('drawing-window')
new DrawingButton(<HTMLButtonElement>document.getElementById('drawing-button'), () => {
    if (drawingWindow !== null) {
        drawingWindow.style.display = 'block'
        drawingCanvas.isDisplay = true
    }
})
const drawingCanvas = new DrawingCanvas(<HTMLCanvasElement>document.getElementById('drawing-canvas'))
