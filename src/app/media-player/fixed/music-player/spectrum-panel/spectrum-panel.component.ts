import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

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

    public fill = 'red';
    private ctx: CanvasRenderingContext2D;
    private hatItems: IHatItem[] = [];
    private height = 200;
    private space = 2;
    private columnWidth = 10;
    private hatSpeed = 10;

    constructor() { }

    get drawer(): HTMLCanvasElement {
        return this.drawerElement.nativeElement as HTMLCanvasElement;
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    ngAfterViewInit() {
        this.drawer.width = 200;
        this.drawer.height = 200;
        this.ctx = this.drawer.getContext('2d');
    }

    private drawColumn(i: number, height: number) {
        this.ctx.fillStyle = this.fill;
        const x = i * (this.columnWidth + this.space);
        const y = this.height - height;
        this.ctx.fillRect(x, y, this.columnWidth, height);
        const maxY = y - this.space;
        if (this.hatItems.length <= i) {
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
            current = Math.min(hat.target, hat.current + this.hatSpeed);
        } else if (hat.current > hat.target) {
            current = Math.max(hat.target, hat.current - this.hatSpeed);
        }
        if (current > maxY) {
            hat.current = maxY;
            if (hat.target >= maxY) {
                hat.target = maxY;
            }
            this.ctx.fillRect(x, maxY - this.space, this.columnWidth, this.space);
            return;
        }
        hat.current = current;
        if (hat.target >= maxY) {
            hat.target = maxY;
        }
        this.ctx.fillRect(x, current - this.space, this.columnWidth, this.space);
    }
}
