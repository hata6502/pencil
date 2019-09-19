import VirtualElement from '@blue-hood/velement';
import * as Settings from '../settings';
import { setNormarizedDrawingData } from '../canvas-utils';

type Mode = 'pencil' | 'fill';

export default class extends VirtualElement<HTMLCanvasElement> {
    public brush: string;
    public color: string = Settings.DRAW_COLOR;
    public isDisplay: boolean = false;
    public tone: number[][] = Settings.TONES.black;
    public mode: Mode = 'pencil';
    public onChangeHistory: (index: number, length: number) => void = (): void => {};
    public onChangeMask: (mask: boolean[][]) => void = (): void => {};

    private context: CanvasRenderingContext2D;
    private history: ImageData[] = [];
    private historyIndex = -1;
    private prevX: number = NaN;
    private prevY: number = NaN;
    private isDrawing: boolean = false;
    private isBackupScheduled: boolean = false;
    private mask: boolean[][] = new Array<boolean[]>(Settings.CANVAS_HEIGHT);

    public constructor(element: HTMLCanvasElement) {
        super(element);

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.brush = Settings.DRAW_BRUSH;

        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString());
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString());

        this.restore();
        this.clearMask();

        setInterval((): void => {
            this.isBackupScheduled = true;
        }, 1000 * Settings.BACKUP_INTERVAL);
        window.addEventListener('beforeunload', (): void => {
            this.backup(true);
        });
    }

    public getScreenPosition(): { x: number; y: number } {
        const rect = this.element.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    }

    public getNormarizedDrawingData(): string {
        let ndd = `${Settings.CANVAS_WIDTH},${Settings.CANVAS_HEIGHT},`;
        const imageData = this.getImageData();
        let i = 0;
        for (let y = 0; y < Settings.CANVAS_HEIGHT; y++) {
            for (let x = 0; x < Settings.CANVAS_WIDTH; x++) {
                const r = Number(imageData.data[i] >= 128);
                const g = Number(imageData.data[i + 1] >= 128);
                const b = Number(imageData.data[i + 2] >= 128);
                const a = Number(imageData.data[i + 3] >= 128);

                ndd += ((r << 0) | (g << 1) | (b << 2) | (a << 3)).toString(16);
                i += Settings.CANVAS_ZOOM * 4;
            }
            i += Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM * 4;
        }

        return ndd;
    }

    public movePath(x: number, y: number): void {
        if (this.isDisplay) {
            if (x >= 0 && x < Settings.CANVAS_WIDTH && y >= 0 && y < Settings.CANVAS_HEIGHT) {
                this.isDrawing = true;
            }

            if (this.isDrawing) {
                if (isNaN(this.prevX)) {
                    if (this.mode == 'fill') {
                        this.fillMask(x, y);
                    }

                    this.drawPoint(x, y);
                } else {
                    this.drawLine(this.prevX, this.prevY, x, y);
                }
            }

            this.prevX = x;
            this.prevY = y;
        }
    }

    public finishPath(): void {
        if (this.isDrawing) {
            if (this.mode == 'fill') {
                this.clearMask();
            }

            this.isDrawing = false;
            this.pushHistory();
        }

        this.prevX = NaN;
    }

    public undo(): void {
        if (this.historyIndex <= 0) {
            return;
        }

        const image = this.history[--this.historyIndex];
        if (image === undefined) {
            return;
        }

        this.context.putImageData(image, 0, 0);
        this.backup();
        this.onChangeHistory(this.historyIndex, this.history.length);
    }

    public redo(): void {
        if (this.historyIndex >= this.history.length - 1) {
            return;
        }

        const image = this.history[++this.historyIndex];
        if (image === undefined) {
            return;
        }

        this.context.putImageData(image, 0, 0);
        this.backup();
        this.onChangeHistory(this.historyIndex, this.history.length);
    }

    public clear(): void {
        this.context.clearRect(
            0,
            0,
            Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM,
            Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM
        );
        this.pushHistory();
    }

    public backup(isForce: boolean = false): void {
        if (this.isBackupScheduled || isForce) {
            const request = new XMLHttpRequest();
            request.open('POST', Settings.BACKUP_URL);
            request.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            request.onload = (): void => {
                if (request.status != 200) {
                    const response: { errors: string[] } = JSON.parse(request.response);
                    alert(response.errors.join('\n'));
                }
            };
            request.onerror = (): void => {
                alert(request.statusText !== '' ? request.statusText : '通信エラーが発生しました。');
            };
            request.send(`drawing=${encodeURIComponent(this.getNormarizedDrawingData())}`);

            this.isBackupScheduled = false;
        }
    }

    private getImageData(): ImageData {
        return this.context.getImageData(
            0,
            0,
            Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM,
            Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM
        );
    }

    private drawPoint(originX: number, originY: number): void {
        const brush = Settings.BRUSHES[this.brush];

        this.context.fillStyle = this.color;
        const fill =
            this.color != 'transparent'
                ? (x: number, y: number, w: number, h: number): void => {
                      this.context.fillRect(x, y, w, h);
                  }
                : (x: number, y: number, w: number, h: number): void => {
                      this.context.clearRect(x, y, w, h);
                  };

        let y = originY - Math.floor(brush.pattern.length / 2);

        brush.pattern.forEach((column): void => {
            if (y >= 0 && y < Settings.CANVAS_HEIGHT) {
                let x = originX - Math.floor(column.length / 2);
                const toneColumn = this.tone[y % this.tone.length];

                column.forEach((pattern): void => {
                    if (x >= 0 && x < Settings.CANVAS_WIDTH) {
                        if (pattern && toneColumn[x % toneColumn.length] && this.mask[y][x]) {
                            fill(
                                x * Settings.CANVAS_ZOOM,
                                y * Settings.CANVAS_ZOOM,
                                Settings.CANVAS_ZOOM,
                                Settings.CANVAS_ZOOM
                            );
                        }
                    }

                    x++;
                });
            }

            y++;
        });
    }

    private drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
        const distance = Math.round(Math.sqrt(Math.pow(toX - fromX, 2.0) + Math.pow(toY - fromY, 2.0)));

        for (let i = 0; i < distance; i++) {
            const rate = i / distance;

            this.drawPoint(fromX + Math.round((toX - fromX) * rate), fromY + Math.round((toY - fromY) * rate));
        }
    }

    private clearMask(): void {
        for (let y = 0; y < Settings.CANVAS_HEIGHT; y++) {
            this.mask[y] = new Array<boolean>(Settings.CANVAS_WIDTH).fill(true);
        }

        this.onChangeMask(this.mask);
    }

    private fillMask(originX: number, originY: number): void {
        for (let y = 0; y < Settings.CANVAS_HEIGHT; y++) {
            this.mask[y] = new Array<boolean>(Settings.CANVAS_WIDTH).fill(false);
        }

        const originImageData = this.context.getImageData(
            originX * Settings.CANVAS_ZOOM,
            originY * Settings.CANVAS_ZOOM,
            1,
            1
        );

        const queue = [{ x: originX, y: originY }];
        let point;
        while ((point = queue.shift())) {
            const { x, y } = point;
            if (x < 0 || x >= Settings.CANVAS_WIDTH || y < 0 || y >= Settings.CANVAS_HEIGHT) {
                continue;
            }
            if (this.mask[y][x]) {
                continue;
            }

            const imageData = this.context.getImageData(x * Settings.CANVAS_ZOOM, y * Settings.CANVAS_ZOOM, 1, 1);
            if (
                imageData.data[0] != originImageData.data[0] ||
                imageData.data[1] != originImageData.data[1] ||
                imageData.data[2] != originImageData.data[2] ||
                imageData.data[3] != originImageData.data[3]
            ) {
                continue;
            }

            this.mask[y][x] = true;
            queue.push({ x: x, y: y - 1 });
            queue.push({ x: x + 1, y: y });
            queue.push({ x: x, y: y + 1 });
            queue.push({ x: x - 1, y: y });
        }

        this.onChangeMask(this.mask);
    }

    private pushHistory(): void {
        while (this.history.length - 1 > this.historyIndex) {
            this.history.pop();
        }

        const image = this.getImageData();
        this.history.push(image);

        while (this.history.length > Settings.HISTORY_MAX_LENGTH) {
            this.history.shift();
        }

        this.historyIndex = this.history.length - 1;
        this.backup();
        this.onChangeHistory(this.historyIndex, this.history.length);
    }

    private restore(): void {
        const request = new XMLHttpRequest();
        request.open('GET', Settings.RESTORE_URL);
        request.onload = (): void => {
            if (request.status == 200) {
                const response: { drawing: string } = JSON.parse(request.response);
                setNormarizedDrawingData(this.context, response.drawing, Settings.CANVAS_ZOOM, false);
                this.pushHistory();
            }
        };
        request.send(null);
    }
}
