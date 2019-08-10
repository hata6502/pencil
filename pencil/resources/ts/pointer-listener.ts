export default class {
    onstart: (() => void) | undefined = undefined;
    onmove: ((x: number, y: number) => void) | undefined = undefined;
    onend: (() => void) | undefined = undefined;
    private isDown: boolean = false;

    constructor() {
        if (navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
            this.initializeWiiUEvents();
        } else {
            this.initializePointerEvents();
        }
    }

    private initializeWiiUEvents(): void {
        setInterval(() => {
            const gamepad = (<any>window).wiiu.gamepad.update();

            if (gamepad.tpTouch) {
                if (!this.isDown && this.onstart !== undefined) {
                    this.onstart();
                }

                if (this.onmove !== undefined) {
                    this.onmove(gamepad.contentX, gamepad.contentY);
                }
                this.isDown = true;
            } else {
                if (this.isDown && this.onend !== undefined) {
                    this.onend();
                }

                this.isDown = false;
            }
        }, 16);
    }

    private initializePointerEvents(): void {
        document.addEventListener('mousedown', (event: MouseEvent) => {
            this.pointerdown(event.clientX, event.clientY);
            event.preventDefault();
        });
        document.addEventListener('mousemove', (event: MouseEvent) => {
            this.pointermove(event.clientX, event.clientY);
            event.preventDefault();
        });
        document.addEventListener('mouseup', (event: MouseEvent) => {
            this.pointerup(event.clientX, event.clientY);
            event.preventDefault();
        });

        document.addEventListener('touchstart', (event: TouchEvent) => {
            this.pointerdown(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
        document.addEventListener('touchmove', (event: TouchEvent) => {
            this.pointermove(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
        document.addEventListener('touchend', (event: TouchEvent) => {
            this.pointerup(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
    }

    private pointerdown(x: number, y: number): void {
        if (this.onstart !== undefined) {
            this.onstart();
        }
        if (this.onmove !== undefined) {
            this.onmove(x, y);
        }
        this.isDown = true;
    }

    private pointermove(x: number, y: number): void {
        if (this.isDown && this.onmove !== undefined) {
            this.onmove(x, y);
        }
    }

    private pointerup(x: number, y: number): void {
        if (this.onmove !== undefined) {
            this.onmove(x, y);
        }
        if (this.onend !== undefined) {
            this.onend();
        }
        this.isDown = false;
    }
}
