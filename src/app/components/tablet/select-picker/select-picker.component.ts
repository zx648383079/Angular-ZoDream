import { Component, ElementRef, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { IPoint, pointFormEvent } from '../../../theme/utils/canvas';

interface IColumn {
    selectedIndex: number,
    items: any[],
    style: {},
}

@Component({
    selector: 'app-select-picker',
    templateUrl: './select-picker.component.html',
    styleUrls: ['./select-picker.component.scss']
})
export class SelectPickerComponent {

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    public readonly lineHeight = input(30);
    public readonly rangeKey = input('id');
    public readonly rangeLabel = input('name');
    public readonly rangeChildren = input('children');
    public readonly columnItems = signal<IColumn[]>([]);
    private startPoint: IPoint = {x: 0, y: 0};

    @HostListener('mousedown', ['$event'])
    public onMouseDown(e: MouseEvent) {
        e.preventDefault();
        this.touchStart(pointFormEvent(e));
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
        e.preventDefault();
        this.touchMove(pointFormEvent(e));
    }

    @HostListener('document:mouseup')
    public onMouseUp() {
        this.touchEnd();
    }

    @HostListener('touchstart', ['$event'])
    public onTouchStart(e: TouchEvent) {
        e.preventDefault();
        this.touchStart(pointFormEvent(e));
    }

    @HostListener('touchmove', ['$event'])
    public onTouchMove(e: TouchEvent) {
        e.preventDefault();
        this.touchMove(pointFormEvent(e));
    }

    @HostListener('touchend')
    public onTouchEnd() {
        this.touchEnd();
    }

    public tapItem(index: number, i: number) {
        this.columnItems()[index].selectedIndex = i;
        this.columnItems()[index].style = this.getIndexStyle(i);
        for (let j = index + 1; j < this.columnItems().length; j ++) {
            // this.refreshColumn(j, 0);
        }
    }

    private touchStart(point: IPoint) {
        this.startPoint = point;
    }

    private touchMove(point: IPoint) {
        const y = point.y - this.startPoint.y;
        const diff = Math.abs(y);
        if (diff >= this.lineHeight()) {
            // 滑动了一个单位就更新起始y 坐标
            this.startPoint.y = point.y;
            this.doMove(diff, y < 0, this.startPoint.x);
        }
    }

    private touchEnd() {

    }

    private doMove(distance: number, isUp = true, x = 0) {
        const diff: number = isUp ? Math.floor(distance / this.lineHeight()) : - Math.ceil(distance / this.lineHeight());
        let column = 0;
        if (diff === 0) {
            return;
        }
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (column > 1) {
            column = Math.floor(x / (rect.width / column));
        }
        this.tapItem(column, this.columnItems()[column].selectedIndex + diff);
    }

    private getIndexStyle(index: number): any {
        const top = 2 * this.lineHeight() - index  * this.lineHeight();
        return {
            transform: 'translate(0px, ' + top + 'px) translateZ(0px)'
        };
    }
}
