import DrawingWindow from './drawing-window'
import DrawingDialog from './drawing-dialog'
import DrawingCanvas from './drawing-canvas'
import PencilButton from './pencil-button'
import PaletteButton from './palette-button'
import HistoryButton from './history-button'
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

const drawingCanvas = new DrawingCanvas(<HTMLCanvasElement>document.getElementById('drawing-canvas'))
drawingCanvas.ontouchdrawstart = () => {
    stickCursor.hide()
}
drawingCanvas.onchangehistory = (index, length) => {
    undoButton.setDisabled(index <= 0)
    redoButton.setDisabled(index >= length - 1)
}

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

let paletteButtons: PaletteButton[] = []
Array.prototype.forEach.call(
    document.getElementsByClassName('palette-button'),
    (paletteButtonElement: HTMLButtonElement) => {
        const paletteButton = new PaletteButton(paletteButtonElement, (color: string) => {
            paletteButtons.forEach((paletteButton: PaletteButton) => {
                paletteButton.inactivate()
            })

            paletteButton.activate()
            drawingCanvas.color = color
        })

        paletteButtons.push(paletteButton)
    }
)

const undoButton = new HistoryButton(<HTMLButtonElement>document.getElementById('undo-button'), () => {
    drawingCanvas.undo()
})

const redoButton = new HistoryButton(<HTMLButtonElement>document.getElementById('redo-button'), () => {
    drawingCanvas.redo()
})

const stickCursor = new StickCursor(
    <HTMLDivElement>document.getElementById('stick-cursor'),
    () => {
        drawingCanvas.startDraw(false)
    },
    () => {
        drawingCanvas.draw(Math.floor(stickCursor.x), Math.floor(stickCursor.y))
    },
    () => {
        drawingCanvas.finishDraw()
    }
)

const previewCanvas = new PreviewCanvas(<HTMLCanvasElement>document.getElementById('preview-canvas'), () => {
    drawingWindow.display()
})
