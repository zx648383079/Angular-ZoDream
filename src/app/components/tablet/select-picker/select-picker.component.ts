import { Component, effect, ElementRef, HostListener, inject, input, model, OnInit, signal, untracked } from '@angular/core';
import { IPoint, pointFormEvent } from '../../../theme/utils/canvas';
import { IControlOption, IDataSource, select, selectedIndex, selectIndex } from '../../form';

interface ISelectColumn {
    items: IControlOption[],
    style: {},
}

@Component({
    standalone: false,
    selector: 'app-select-picker',
    templateUrl: './select-picker.component.html',
    styleUrls: ['./select-picker.component.scss']
})
export class SelectPickerComponent {

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    public readonly lineHeight = input(30);
    public readonly source = input.required<IDataSource>();
    public readonly items = signal<ISelectColumn[]>([]);
    public readonly value = model<any>();
    private startPoint: IPoint;

    private get isTouched() {
        return !!this.startPoint;
    }

    constructor() {
        effect(() => {
            const src = this.source();
            const val = this.value();
            untracked(() => {
                src.initialize(val).subscribe(v => {
                    this.items.set(v.map(i => {
                        return <ISelectColumn>{
                            items: i,
                            style: this.getIndexStyle(selectedIndex(i))
                        };
                    }));
                });
            });
        });
    }

    @HostListener('mousedown', ['$event'])
    public onMouseDown(e: MouseEvent) {
        e.preventDefault();
        this.touchStart(pointFormEvent(e));
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
        if (!this.isTouched) {
            return;
        }
        e.preventDefault();
        this.touchMove(pointFormEvent(e));
    }

    @HostListener('document:mouseup')
    public onMouseUp() {
        if (!this.isTouched) {
            return;
        }
        this.touchEnd();
    }

    @HostListener('touchstart', ['$event'])
    public onTouchStart(e: TouchEvent) {
        e.preventDefault();
        this.touchStart(pointFormEvent(e));
    }

    @HostListener('touchmove', ['$event'])
    public onTouchMove(e: TouchEvent) {
        if (!this.isTouched) {
            return;
        }
        e.preventDefault();
        this.touchMove(pointFormEvent(e));
    }

    @HostListener('touchend')
    public onTouchEnd() {
        if (!this.isTouched) {
            return;
        }
        this.touchEnd();
    }

    public tapItem(index: number, i: number, e?: MouseEvent) {
        e?.stopPropagation();
        this.items.update(v => {
            const group = v[index];
            group.style = this.getIndexStyle(i);
            selectIndex(group.items, i);
            for (let j = index + 1; j < v.length; j ++) {
                // this.refreshColumn(j, 0);
            }
            return [...v];
        });
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
        this.startPoint = undefined;
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
        this.tapItem(column, selectedIndex(this.items()[column].items) + diff);
    }

    private getIndexStyle(index: number): any {
        const top = 2 * this.lineHeight() - index  * this.lineHeight();
        return {
            transform: 'translate(0px, ' + top + 'px) translateZ(0px)'
        };
    }
}
