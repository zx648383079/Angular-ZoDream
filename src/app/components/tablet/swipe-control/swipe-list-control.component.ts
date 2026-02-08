import { Component, contentChildren, effect, HostListener } from '@angular/core';
import { SwipeControlComponent } from './swipe-control.component';
import { IPoint } from '../../../theme/utils/canvas';

enum TouchState {
    None,
    Scroll,
    Touch,
    Mouse,
}

@Component({
    standalone: false,
    selector: 'app-swipe-list-control',
    template: `<div class="swipe-list-control">
        <ng-content />
    </div>`,
    styleUrls: []
})
export class SwipeListControlComponent {
    public readonly items = contentChildren(SwipeControlComponent);

    private startChild: SwipeControlComponent;
    private state = TouchState.None;
    private startPoint: IPoint;
    private lastPoint: IPoint;
    private startTime = 0;
    private isTouchMoved = false; 

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
        if (this.state === TouchState.None) {
            return;
        }
        this.touchMove({x: e.clientX, y: e.clientY}, e);
    }

    @HostListener('document:mouseup')
    public onMouseUp() {
        if (this.state === TouchState.None) {
            return;
        }
        this.touchEnd();
    }

    @HostListener('touchmove', ['$event'])
    public onTouchMove(e: TouchEvent) {
        if (this.state === TouchState.None) {
            return;
        }
        const src = e.targetTouches[0];
        this.touchMove({x: src.clientX, y: src.clientY}, e);
    }

    @HostListener('touchend')
    public onTouchEnd() {
        if (this.state === TouchState.None) {
            return;
        }
        this.touchEnd();
    }

    private get isJustTouched(): boolean {
        if (!this.startTime || !this.startPoint || this.isTouchMoved) {
            return false;
        }
        const diff = Date.now() - this.startTime;
        if (diff > 100000) {
            return false;
        }
        if (!this.lastPoint) {
            return true;
        }
        return Math.abs(this.startPoint.x - this.lastPoint.x) < 10 
            && Math.abs(this.startPoint.y - this.lastPoint.y) < 10;
    }

    private get isScroll(): boolean {
        if (!this.lastPoint || !this.startPoint) {
            return;
        }
        return Math.abs(this.startPoint.x - this.lastPoint.x) < Math.abs(this.startPoint.y - this.lastPoint.y);
    }

    constructor() {
        effect(() => {
            const items = this.items();
            for (const item of items) {
                item.parent = this;
            }
        });
    }

    public touchStart(target: SwipeControlComponent, point: IPoint, isTouched = false) {
        if (this.startChild) {
            this.startChild.touchEnd();
            this.startChild = null;
        }
        this.startChild = target;
        this.state = isTouched ? TouchState.Touch : TouchState.Mouse;
        this.startPoint = point;
        this.lastPoint = undefined;
        this.startTime = Date.now();
        this.isTouchMoved = false;
        this.siblings(target).forEach(i => i.reset());
        target.touchStart();
    }

    public touchMove(point: IPoint, e: Event) {
        const target = this.startChild;
        let lastPoint = this.lastPoint;
        this.lastPoint = point;
        this.isTouchMoved = true;
        if (!lastPoint) {
            if (this.isScroll) {
                this.state = TouchState.Scroll;
            }
            lastPoint = this.startPoint;
        }
        if (this.state === TouchState.Scroll) {
            return;
        }
        if (!target) {
            return;
        }
        e.preventDefault();
        target.touchMove(this.lastPoint.x - this.startPoint.x);
    }

    public touchEnd() {
        const target = this.startChild;
        const isJustTouched = this.isJustTouched;
        this.startChild = null;
        this.state = TouchState.None;
        if (!target) {
            return;
        }
        if (isJustTouched) {
            target.touched();
            return;
        }
        target.touchEnd();
    }

    public siblings(exclude: SwipeControlComponent): SwipeControlComponent[] {
        const items = [];
        for (let i = 0; i < this.items().length; i++) {
            const item = this.items().at(i);
            if (item === exclude) {
                continue;
            }
            items.push(item);
        }
        return items;
    }
}