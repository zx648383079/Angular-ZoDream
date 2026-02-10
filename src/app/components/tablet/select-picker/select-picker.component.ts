import { Component, effect, ElementRef, HostListener, inject, input, model, signal, untracked } from '@angular/core';
import { IPoint, pointFormEvent } from '../../../theme/utils/canvas';
import { IControlOption, IDataSource, selectedIndex, selectIndex } from '../../form';
import { checkRange } from '../../../theme/utils';

interface ISelectColumn {
    selected: number;
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
    private isTouchMoved = false;
    private lastPoint: IPoint;

    private get isTouched() {
        return !!this.startPoint;
    }

    private get isJustTouched(): boolean {
        if (!this.startPoint || this.isTouchMoved) {
            return false;
        }
        if (!this.lastPoint) {
            return true;
        }
        return Math.abs(this.startPoint.x - this.lastPoint.x) < 10 
            && Math.abs(this.startPoint.y - this.lastPoint.y) < 10;
    }

    constructor() {
        effect(() => {
            const src = this.source();
            const val = this.value();
            untracked(() => {
                src.initialize(val).subscribe(res => {
                    this.initialize(res);
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

    public tapItem(index: number, i: number) {
        const items = this.items();
        this.select(items, index, i);
    }

    private initialize(data: IControlOption[][]) {
        this.items.set(data.map(group => {
            const selected = Math.max(0, selectedIndex(group));
            return <ISelectColumn>{
                selected,
                items: group,
                style: this.getIndexStyle(selected)
            };
        }));
    }

    private select(items: ISelectColumn[], index: number, i: number) {
        index = checkRange(index, 0, items.length - 1);
        const group = items[index];
        group.selected = checkRange(i, 0, group.items.length - 1);
        group.style = this.getIndexStyle(group.selected);
        selectIndex(group.items, group.selected);
        const src = this.source();
        const next = src.influence(index);
        if (next < 0) {
            this.items.set([...items]);
            this.value.set(src.format(...items.map(i => i.items[i.selected])));
            return;
        }
        src.select(items.map(i => i.items[i.selected]), next).subscribe(res => {
            items[next].items = res;
            this.select(items, next, 0);
        });
    }

    private touchStart(point: IPoint) {
        this.startPoint = point;
        this.lastPoint = undefined;
        this.isTouchMoved = false;
    }

    private touchMove(point: IPoint) {
        this.isTouchMoved = true;
        this.lastPoint = point;
        const y = point.y - this.startPoint.y;
        const diff = Math.abs(y);
        if (diff >= this.lineHeight()) {
            // 滑动了一个单位就更新起始y 坐标
            this.startPoint.y = point.y;
            this.doMove(diff, y < 0, this.startPoint.x);
        }
    }

    private touchEnd() {
        if (this.isJustTouched) {
            this.touched(this.startPoint);
        }
        this.startPoint = undefined;
        this.isTouchMoved = false;
    }

    private touched(point: IPoint) {
        const columnItems = this.items();
        const lineHeight = this.lineHeight();
        let column = 0;
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (columnItems.length > 1) {
            column = checkRange(Math.floor((point.x - rect.left) / (rect.width / columnItems.length)), 0, columnItems.length - 1);
        }
        const diff = Math.floor(((point.y - rect.top) - (rect.height - lineHeight) / 2) / lineHeight);
        if (diff === 0) {
            return;
        }    
        this.tapItem(column, columnItems[column].selected + diff);
    }

    private doMove(distance: number, isUp = true, x = 0) {
        const lineHeight = this.lineHeight();
        const diff: number = isUp ? Math.floor(distance / lineHeight) : - Math.ceil(distance / lineHeight);
        let column = 0;
        if (diff === 0) {
            return;
        }
        const columnItems = this.items();
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (columnItems.length > 1) {
            column = checkRange(Math.floor((x - rect.left) / (rect.width / columnItems.length)), 0, columnItems.length - 1);
        }
        this.tapItem(column, columnItems[column].selected + diff);
    }

    private getIndexStyle(index: number): any {
        const top = 2 * this.lineHeight() - index  * this.lineHeight();
        return {
            transform: 'translate(0px, ' + top + 'px) translateZ(0px)'
        };
    }
}
