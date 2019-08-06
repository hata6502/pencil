import * as Settings from './settings'

type Mode = 'pencil' | 'text'

export default class {
    brush: string
    color: string = Settings.DRAW_COLOR
    onchangehistory: ((index: number, length: number) => void) | undefined = undefined
    text: string = ''
    mode: Mode = 'pencil'
    isDisplay: boolean = false
    private element: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private history: ImageData[] = []
    private historyIndex = -1
    private prevX: number = -1;
    private prevY: number = -1;
    private isDrawing: boolean = false;

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

        this.backupCanvas()
    }

    getScreenPosition(): { x: number, y: number } {
        const rect = this.element.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    }

    getDrawing(): ImageData {
        return this.context.getImageData(
            0,
            0,
            Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM,
            Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM
        )
    }

    movePath(x: number, y: number): void {
        if (this.isDisplay) {
            if (x >= 0 && x < Settings.CANVAS_WIDTH && y >= 0 && y < Settings.CANVAS_HEIGHT) {
                if (this.prevX == -1) {
                    this.drawPoint(x, y);
                } else {
                    this.drawLine(this.prevX, this.prevY, x, y);
                }

                this.isDrawing = true;
            }

            this.prevX = x
            this.prevY = y
        }
    }

    finishPath(): void {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.backupCanvas()
        }

        this.prevX = -1;
    }

    undo(): void {
        if (this.historyIndex <= 0) {
            return
        }

        const drawing = this.history[--this.historyIndex]
        if (drawing === undefined) {
            return
        }

        this.context.putImageData(drawing, 0, 0)

        if (this.onchangehistory !== undefined) {
            this.onchangehistory(this.historyIndex, this.history.length)
        }
    }

    redo(): void {
        if (this.historyIndex >= this.history.length - 1) {
            return
        }

        const drawing = this.history[++this.historyIndex]
        if (drawing === undefined) {
            return
        }

        this.context.putImageData(drawing, 0, 0)

        if (this.onchangehistory !== undefined) {
            this.onchangehistory(this.historyIndex, this.history.length)
        }
    }

    private drawPoint(originX: number, originY: number) {
        const brush = Settings.BRUSH_PATTERNS[this.brush]

        this.context.fillStyle = this.color

        switch (this.mode) {
            case 'pencil': {
                let y: number = originY - Math.floor(brush.pattern.length / 2)
                brush.pattern.forEach(column => {
                    let x: number = originX - Math.floor(column.length / 2)
                    column.forEach(pattern => {
                        if (pattern) {
                            this.context.fillRect(
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
                break
            }

            case 'text': {
                this.context.font = brush.fontsize * Settings.CANVAS_ZOOM + 'px sans-serif'
                this.context.textBaseline = 'middle'
                this.context.fillText(this.text, originX * Settings.CANVAS_ZOOM, originY * Settings.CANVAS_ZOOM)
                break
            }
        }
    }

    private drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
        if (this.mode == 'text') {
            return
        }

        const distance = Math.round(Math.sqrt(Math.pow(toX - fromX, 2.0) + Math.pow(toY - fromY, 2.0))) + 1

        for (let i = 0; i < distance; i++) {
            const rate = i / (distance - 1)

            this.drawPoint(fromX + Math.round((toX - fromX) * rate), fromY + Math.round((toY - fromY) * rate))
        }
    }

    private backupCanvas(): void {
        while (this.history.length - 1 > this.historyIndex) {
            this.history.pop()
        }

        this.history.push(this.getDrawing())

        while (this.history.length > Settings.HISTORY_MAX_LENGTH) {
            this.history.shift()
        }

        this.historyIndex = this.history.length - 1
        if (this.onchangehistory !== undefined) {
            this.onchangehistory(this.historyIndex, this.history.length)
        }
    }
}
