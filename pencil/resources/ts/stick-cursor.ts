import * as Settings from './settings'

export default class {
    x: number = Math.floor(Settings.CANVAS_WIDTH / 2)
    y: number = Math.floor(Settings.CANVAS_HEIGHT / 2)
    private element: HTMLDivElement
    private isEnterPressed: boolean = false
    private isDrawing: boolean = false
    private ondrawstart: () => void
    private ondraw: () => void
    private ondrawend: () => void

    constructor(element: HTMLDivElement, ondrawstart: () => void, ondraw: () => void, ondrawend: () => void) {
        this.element = element
        this.ondrawstart = ondrawstart
        this.ondraw = ondraw
        this.ondrawend = ondrawend

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            switch (event.keyCode) {
                case Settings.KEYCODE_UP:
                    this.y--
                    break

                case Settings.KEYCODE_DOWN:
                    this.y++
                    break

                case Settings.KEYCODE_LEFT:
                    this.x--
                    break

                case Settings.KEYCODE_RIGHT:
                    this.x++
                    break

                case Settings.KEYCODE_ENTER:
                    this.isEnterPressed = true
                    break

                default:
                    return
            }

            this.draw()
            event.preventDefault()
        })

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            switch (event.keyCode) {
                case Settings.KEYCODE_ENTER:
                    if (this.isDrawing) {
                        this.ondrawend()
                    }
                    this.isEnterPressed = false
                    this.isDrawing = false
                    break
            }
        })

        if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
            setInterval(() => {
                const gamepad = (<any>window).wiiu.gamepad.update()

                if (gamepad.lStickX !== 0.0 || gamepad.lStickY !== 0.0) {
                    this.x += gamepad.lStickX
                    this.y -= gamepad.lStickY
                    this.draw()
                }
            }, 16)
        }
    }

    hide() {
        this.element.style.display = 'none'
    }

    private draw() {
        if (this.isEnterPressed) {
            if (this.x >= 0 && this.x < Settings.CANVAS_WIDTH && this.y >= 0 && this.y < Settings.CANVAS_HEIGHT) {
                if (!this.isDrawing) {
                    this.ondrawstart()
                    this.isDrawing = true
                }
                this.ondraw()
            }
        }

        this.element.style.left = Math.floor(this.x) * Settings.CANVAS_ZOOM + 3 + 'px'
        this.element.style.top = Math.floor(this.y) * Settings.CANVAS_ZOOM - 1 + 'px'
        this.element.style.display = 'block'
    }
}
