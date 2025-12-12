import { AfterViewInit, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

interface ITurnItem {
    index: number;
    text: string;
    image?: string;
    color?: string;
    background: string;
    // 角度范围
    deg: number[];
}

@Component({
    standalone: false,
    selector: 'app-turntable',
    templateUrl: './turntable.component.html',
    styleUrls: ['./turntable.component.scss']
})
export class TurntableComponent implements AfterViewInit {

    private readonly drawerElement = viewChild<ElementRef<HTMLCanvasElement>>('drawerBox');
    public readonly items = input<any[]>([]);
    public readonly buttonText = input('抽奖');
    public readonly size = input(500);
    public readonly loading = output<TurntableComponent>();
    public readonly finished = output();

    public canvasStyle = {};
    public pointerStyle: any = {};
    private formatItems: ITurnItem[] = [];
    private ctx: CanvasRenderingContext2D;
    private booted = false;

    public isRunning = false;
    private timer = 0;
    private currentDeg = 0;

    constructor() {
        this.initStyle();
        effect(() => {
            this.items();
            this.formatOption();
        });
        effect(() => {
            this.size();
            this.initStyle();
        });
    }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement().nativeElement as HTMLCanvasElement;
    }

    public tapStart() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.runBefore();
        this.loading.emit(this);
    }

    /**
     * 设置中奖礼品
     */
    public defineGift(item: any) {
        this.defineGiftIndex(this.getIndexInFormat(item));
    }

    public defineGiftIndex(index: number) {
        this.stopTimer();
        const item = this.formatItems[index];
        // 要跑这么多步
        const count = this.randomDeg(index) + (2  + Math.floor(Math.random() * 3)) * 360 - this.currentDeg;
        // 匀速的数量
        const uniformSpeed  = Math.ceil(count * .7);
        // 跑了多少格了
        let i  = 0;
        // 当前速度
        let speed = 16;
        const maxSpeed = 300;
        const acceleration = Math.max(1, Math.floor((maxSpeed - speed) / (count - uniformSpeed)));
        const runStep = () => {
            i += 5;
            if (i > uniformSpeed) {
                speed += acceleration;
            }
            this.goNext();
            if (i >= count) {
                this.timer = 0;
                this.isRunning = false;
                this.finished.emit();
                return;
            }
            this.timer = window.setTimeout(runStep, speed);
        };
        this.timer = window.setTimeout(runStep, speed);
    }

    private randomDeg(index: number): number {
        const item = this.formatItems[index];
        return item.deg[0] + 1 + Math.ceil((item.deg[1] - item.deg[0] - 6) * Math.random());
    }

    private stopTimer() {
        if (this.timer > 0) {
            clearTimeout(this.timer);
            this.timer = 0;
        }
    }

    /**
     * 确定中奖前做的无意义跑步
     */
    private runBefore() {
        this.timer = window.setTimeout(() => {
            this.goNext();
            this.runBefore();
        }, 16);
    }

    private goNext() {
        this.changeDeg(this.currentDeg + 5);
    }

    /**
     * 获取中奖礼品在格子中的位置
     */
    private getIndexInFormat(item: any): number {
        let index = -1;
        for (let i = 0; i < this.items().length; i++) {
            if (this.items()[i].name === item.name) {
                index = i;
                break;
            }
        }
        for (let i = 0; i < this.formatItems.length; i++) {
            if (this.formatItems[i].index === index) {
                return i;
            }
        }
        return 0;
    }

    private changeDeg(deg: number) {
        deg = deg % 360;
        if (deg < 0) {
            deg += 360;
        }
        this.currentDeg = deg;
        this.pointerStyle.transform = 'rotateZ(' + deg + 'deg)';
    }

    private initStyle() {
        this.canvasStyle = {
            width: this.size() + 'px',
            height: this.size() + 'px',
        };
        const center = this.size() / 2;
        this.pointerStyle = {
            left: center + 'px',
            top: center + 'px',
        };
    }

    ngAfterViewInit() {
        this.drawer.width = this.size();
        this.drawer.height = this.size();
        this.ctx = this.drawer.getContext('2d');
        this.ctx.translate(this.size() / 2, this.size() / 2);
        if (this.formatItems.length > 0) {
            this.refreshGift();
        }
    }

    private formatOption() {
        let total = 0;
        for (const item of this.items()) {
            total += item.chance;
        }
        let start = 0;
        this.formatItems = this.items().map((item, i) => {
            return {
                index: i,
                text: item.name,
                image: item.goods ? item.goods.thumb : null,
                background: item.color,
                color: item.foreground,
                deg: [start, start += item.chance * 360 / total]
            };
        });
        this.booted = false;
        this.refreshGift();
    }

    private refreshGift() {
        if (this.booted || !this.ctx) {
            return;
        }
        this.booted = true;
        for (const item of this.formatItems) {
            this.drawItem(item);
        }
    }


    private degToAngle(i: number) {
        i = (i - 90) % 360;
        if (i < 0) {
            i += 360;
        }
        return i * Math.PI / 180 ;
    }

    private drawItem(item: ITurnItem, ctx: CanvasRenderingContext2D = this.ctx) {
        const [img, angle] = this.createArc(item);
        ctx.rotate(angle);
        ctx.drawImage(img, - this.size() / 2, - this.size() / 2, this.size(), this.size());
        ctx.rotate(-angle);
    }

    private createArc(item: ITurnItem): any[] {
        const canvas = document.createElement('canvas');
        canvas.width = this.size();
        canvas.height = this.size();
        const ctx = canvas.getContext('2d');
        const centerAngle = (item.deg[0] + item.deg[1]) / 2;
        ctx.beginPath();
        const size = this.size();
        ctx.moveTo(size / 2, size / 2);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = item.background;
        ctx.arc(size / 2, size / 2, size / 2, this.degToAngle(item.deg[0] - centerAngle), this.degToAngle(item.deg[1] - centerAngle));
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.font = '16px scans-serif';
        ctx.fillStyle = item.color || '#000';
        ctx.fillText(item.text, (size - item.text.length * 16) / 2, size * .1);
        return [canvas, this.degToAngle(centerAngle + 90)];
    }

}
