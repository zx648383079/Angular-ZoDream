import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

interface ITurnItem {
    index: number;
    text: string;
    image?: string;
    background: string;
    // 角度范围
    deg: number[];
}

@Component({
  selector: 'app-turntable',
  templateUrl: './turntable.component.html',
  styleUrls: ['./turntable.component.scss']
})
export class TurntableComponent implements AfterViewInit, OnChanges {

    @ViewChild('drawerBox')
    private drawerElement: ElementRef<HTMLCanvasElement>;
    @Input() public items: any[] = [];
    @Input() public buttonText = '抽奖';
    @Output() public loading = new EventEmitter();

    private formatItems: ITurnItem[] = [];
    private ctx: CanvasRenderingContext2D;

    constructor() { }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement.nativeElement as HTMLCanvasElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this.formatOption();
        }
    }

    ngAfterViewInit() {
        this.drawer.width = 500;
        this.drawer.height = 500;
        this.ctx = this.drawer.getContext('2d');
        this.ctx.translate(250, 250);
        this.drawItem({
            index: 0,
            text: '未中奖',
            background: 'red',
            deg: [45, 90],
        });
    }

    private formatOption() {
        let start = 0;
        this.formatItems = this.items.map((item, i) => {
            return {
                index: i,
                text: item.name,
                image: item.goods ? item.goods.thumb : null,
                background: item.color,
                deg: [start, start += item.chance * 360 / 100]
            };
        });
    }


    private degToAngle(i: number) {
        i = (i - 45) % 360;
        if (i < 0) {
            i += 360;
        }
        return i / 180 * Math.PI;
    }

    private drawItem(item: ITurnItem, ctx: CanvasRenderingContext2D = this.ctx) {
        const start = this.degToAngle(item.deg[0]);
        const end = this.degToAngle(item.deg[1]);
        const angle = (start + end) / 2;
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.strokeStyle = 'white';
        ctx.fillStyle = item.background;
        ctx.arc(0, 0, 250, start - angle, end - angle);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.font = '16px scans-serif';
        ctx.fillStyle = '#000';
        ctx.fillText(item.text, - (item.text.length * 16) / 2, 200);
        // ctx.rotate(-angle);
    }

}
