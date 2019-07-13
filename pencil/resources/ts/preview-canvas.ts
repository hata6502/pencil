import * as Settings from './settings'

export default class {
    private context: CanvasRenderingContext2D

    constructor(element: HTMLCanvasElement, onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
        const context = element.getContext('2d')
        if (context === null) {
            throw "Couldn't get context. "
        }
        this.context = context

        element.style.width = Settings.CANVAS_WIDTH + 'px'
        element.style.height = Settings.CANVAS_HEIGHT + 'px'
        element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString())
        element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString())

        var image = new Image()
        image.src = Settings.IMAGE_URL
        image.onload = () => {
            this.context.drawImage(
                image,
                (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM - 128) / 2,
                (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM - 128) / 2,
                128,
                128
            )
        }

        element.onclick = onclick
    }

    setDrawing(drawing: ImageData) {
        this.context.putImageData(drawing, 0, 0)
    }
}
