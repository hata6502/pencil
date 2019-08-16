export default class {
    onStart: () => void = () => {};
    onMove: (x: number, y: number) => void = () => {};
    onEnd: () => void = () => {};
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
                if (!this.isDown) {
                    this.onStart();
                }

                this.onMove(gamepad.contentX, gamepad.contentY);
                this.isDown = true;
            } else {
                if (this.isDown) {
                    this.onEnd();
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
        this.onStart();
        this.onMove(x, y);
        this.isDown = true;
    }

    private pointermove(x: number, y: number): void {
        if (this.isDown) {
            this.onMove(x, y);
        }
    }

    private pointerup(x: number, y: number): void {
        this.onMove(x, y);
        this.onEnd();
        this.isDown = false;
    }
}
