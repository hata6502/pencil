import * as Settings from './settings'

export default class {
    x: number = Math.floor(Settings.CANVAS_WIDTH / 2)
    y: number = Math.floor(Settings.CANVAS_HEIGHT / 2)
    onmove: (() => void) | undefined = undefined
    onend: (() => void) | undefined = undefined
    private element: HTMLDivElement
    private isEnterPressed: boolean = false

    constructor(element: HTMLDivElement) {
        this.element = element

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

            this.move()
            event.preventDefault()
        })

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            switch (event.keyCode) {
                case Settings.KEYCODE_ENTER:
                    if (this.isEnterPressed && this.onend !== undefined) {
                        this.onend()
                    }
                    this.isEnterPressed = false
                    break
            }
        })

        if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
            setInterval(() => {
                const gamepad = (<any>window).wiiu.gamepad.update()

                if (gamepad.lStickX !== 0.0 || gamepad.lStickY !== 0.0) {
                    this.x += gamepad.lStickX
                    this.y -= gamepad.lStickY
                    this.move()
                }
            }, 16)
        }
    }

    hide() {
        this.element.style.display = 'none'
    }

    private move() {
        if (this.isEnterPressed && this.onmove !== undefined) {
            this.onmove()
        }

        this.element.style.left = Math.floor(this.x) * Settings.CANVAS_ZOOM + 3 + 'px'
        this.element.style.top = Math.floor(this.y) * Settings.CANVAS_ZOOM - 1 + 'px'
        this.element.style.display = 'block'
    }
}
