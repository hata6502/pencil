export default class {
  onstart: (() => void) | undefined = undefined
  onmove: ((x: number, y: number) => void) | undefined = undefined
  onend: (() => void) | undefined = undefined

  constructor() {
    if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
      this.initializeWiiUEvents()
    } else {
      this.initializePointerEvents()
    }
  }

  private initializeWiiUEvents(): void {
    let isDown: boolean = false

    setInterval(() => {
      const gamepad = (<any>window).wiiu.gamepad.update()

      if (gamepad.tpTouch) {
        if (!isDown && this.onstart !== undefined) {
          this.onstart();
        }

        if (this.onmove !== undefined) {
          this.onmove(gamepad.contentX, gamepad.contentY);
        }
        isDown = true
      } else {
        if (isDown && this.onend !== undefined) {
          this.onend();
        }

        isDown = false
      }

    }, 16)
  }

  private initializePointerEvents(): void {
    let isDown: boolean = false

    document.addEventListener('pointerdown', (event: PointerEvent) => {
      if (this.onstart !== undefined) {
        this.onstart();
      }
      if (this.onmove !== undefined) {
        this.onmove(event.clientX, event.clientY);
      }
      isDown = true

      event.preventDefault()
    });

    document.addEventListener('pointermove', (event: PointerEvent) => {
      if (isDown && this.onmove !== undefined) {
        this.onmove(event.clientX, event.clientY);
      }

      event.preventDefault()
    });

    document.addEventListener('pointerup', (event: PointerEvent) => {
      if (this.onmove !== undefined) {
        this.onmove(event.clientX, event.clientY);
      }
      if (this.onend !== undefined) {
        this.onend();
      }
      isDown = false

      event.preventDefault()
    });
  }
}
