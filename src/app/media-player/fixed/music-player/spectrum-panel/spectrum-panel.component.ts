import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

interface IHatItem {
    current: number;
    target: number;
}

@Component({
  selector: 'app-spectrum-panel',
  templateUrl: './spectrum-panel.component.html',
  styleUrls: ['./spectrum-panel.component.scss']
})
export class SpectrumPanelComponent implements OnChanges, AfterViewInit {

    @ViewChild('drawerBox')
    private drawerElement: ElementRef;

    @Input() public value: number[] = [];
    public fill = 'red';
    private ctx: CanvasRenderingContext2D;
    private hatItems: IHatItem[] = [];
    private height = 200;
    private space = 2;
    private columnWidth = 10;
    private hatSpeed = 10;

    constructor() {
        // setInterval(() => {
        //     if (!this.ctx) {
        //         return;
        //     }
        //     const items: number[] = [];
        //     for (let i = 0; i < 30; i++) {
        //         items.push(Math.random() * 100);
        //     }
        //     this.drawColumns(items);
        // }, 200);
    }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement.nativeElement as HTMLCanvasElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.drawColumns(this.value);
        }
    }

    ngAfterViewInit() {
        this.drawer.width = 200;
        this.drawer.height = 200;
        this.ctx = this.drawer.getContext('2d');
    }

    private drawColumns(items: number[]) {
        this.ctx.clearRect(0, 0, 200, 200);
        items.forEach((v, i) => {
            this.drawColumn(i, v);
        });
    }

    private drawColumn(i: number, height: number) {
        this.ctx.fillStyle = this.fill;
        const x = i * (this.columnWidth + this.space);
        const y = this.height - height;
        this.ctx.fillRect(x, y, this.columnWidth, height);
        const maxY = y - this.space;
        if (this.hatItems.length <= i) {
            // 新的柱子，帽子直接放到上面
            this.hatItems.push({
                current: maxY,
                target: this.height,
            });
            this.ctx.fillRect(x, maxY - this.space, this.columnWidth, this.space);
            return;
        }
        const hat = this.hatItems[i];
        let current = hat.current;
        if (hat.current < hat.target) {
            // 帽子下落
            current = Math.min(hat.target, hat.current + this.hatSpeed);
        } else if (hat.current > hat.target) {
            // 帽子上升
            current = Math.max(hat.target, hat.current - this.hatSpeed);
        }
        if (current > maxY) {
            // 新位置在上方
            hat.current = maxY;
            if (hat.target >= maxY) {
                hat.target = maxY;
            }
            this.ctx.fillRect(x, maxY - this.space, this.columnWidth, this.space);
            return;
        }
       
        if (hat.target <= maxY) {
            hat.target = maxY;
        }
        current = Math.min(hat.target, hat.current + this.hatSpeed);
        hat.current = current;
        this.ctx.fillRect(x, current - this.space, this.columnWidth, this.space);
    }
}
