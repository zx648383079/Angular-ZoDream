import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

interface ILatticeItem {
    index: number;
    text: string;
    image: string;
    style?: any;
}

@Component({
    standalone: false,
  selector: 'app-lattice',
  templateUrl: './lattice.component.html',
  styleUrls: ['./lattice.component.scss']
})
export class LatticeComponent implements OnChanges {

    @Input() public items: any[] = [];
    @Input() public buttonText = '抽奖';
    @Input() public margin = 0;
    @Input() public space = 10;
    @Input() public size = 0;
    @Output() public loading = new EventEmitter();
    @Output() public finished = new EventEmitter();
    public formatItems: ILatticeItem[] = [];
    public currentIndex = 0;
    public boxStyle: any = {};
    public buttonStyle: any = {};
    public isRunning = false;
    private timer = 0;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this.formatOption();
        }
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
        // 要跑这么多步
        const count = index + (5  + Math.floor(Math.random() * 6)) * this.formatItems.length - this.currentIndex;
        // 匀速的数量
        const uniformSpeed  = Math.ceil(count * .7);
        // 跑了多少格了
        let i  = 0;
        // 当前速度
        let speed = 100;
        const maxSpeed = 2000;
        const acceleration = Math.max(10, Math.floor((maxSpeed - speed) / (count - uniformSpeed)));
        const runStep = () => {
            i ++;
            if (i > uniformSpeed) {
                speed += acceleration;
            }
            this.goNext();
            if (i === count) {
                this.timer = 0;
                this.isRunning = false;
                this.finished.emit();
                return;
            }
            this.timer = window.setTimeout(runStep, speed);
        };
        this.timer = window.setTimeout(runStep, speed);
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
        }, 100);
    }

    /**
     * 获取中奖礼品在格子中的位置
     */
    private getIndexInFormat(item: any): number {
        let index = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === item.id) {
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

    private goNext() {
        this.currentIndex = this.currentIndex >= this.formatItems.length - 1 ? 0 : (this.currentIndex + 1);
    }

    private formatOption() {
        const lineCount = Math.max(3, Math.ceil((this.items.length / 4 + 1)));
        const size = this.size > 0 ? this.size : window.innerWidth * .8 / lineCount;
        const notWinning = this.getNotWinning();
        const items: ILatticeItem[] = [];
        for (let i = lineCount * 4 - 5; i >= 0; i--) {
            const index = this.items.length > i ? i : notWinning;
            items.push({
                index,
                text: index >= 0 ? this.items[index].name : (i + '未中奖'),
                image: index >= 0 && this.items[index].goods ? this.items[index].goods.thumb : null,
            });
        }
        this.randArr(items);
        this.formatItems = items.map((item, i) => {
            item.style = {
                top: (this.margin + this.getTop(i, lineCount, size)) + 'px',
                left: (this.margin + this.getLeft(i, lineCount, size)) + 'px',
                width: size + 'px',
                height: size + 'px',
            };
            return item;
        });
        const width = this.margin * 2 + size * lineCount + (lineCount - 1) * this.space;
        this.boxStyle = {
            width: width + 'px',
            height: width + 'px',
        };
        const buttonWidth = Math.min(80, size);
        const buttonHeight = Math.min(50, size);
        this.buttonStyle = {
            left: (width - buttonWidth) / 2 + 'px',
            top: (width - buttonHeight) / 2 + 'px',
            width: buttonWidth + 'px',
            height: buttonHeight + 'px',
            'line-height': buttonHeight + 'px',
        };
    }

    private randArr<T>(items: T[]): T[] {
        for (let i = 0; i < items.length; i++) {
            const rand = Math.floor(items.length * Math.random());
            [items[i], items[rand]] = [items[rand], items[i]];
        }
        return items;
    }

    private getTop(i: number, lineCount: number, size: number): number {
        if (i < lineCount - 1) {
            return 0;
        }
        if (i < 2 * lineCount - 1) {
            return (i - lineCount + 1) * (size + this.space);
        }
        if (i < 3 * lineCount - 2) {
            return (lineCount - 1) * (size + this.space);
        }
        return (4 * lineCount - i - 4) * (size + this.space);
    }

    private getLeft(i: number, lineCount: number, size: number): number {
        if (i < lineCount - 1) {
            return i * (size + this.space);
        }
        if (i < 2 * lineCount - 1) {
            return (lineCount - 1) * (size + this.space);
        }
        if (i < 3 * lineCount - 3) {
            return (3 * lineCount - i - 3) * (size + this.space);
        }
        return 0;
    }


    private getNotWinning(): number {
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].goods) {
                return i;
            }
        }
        return -1;
    }

}
