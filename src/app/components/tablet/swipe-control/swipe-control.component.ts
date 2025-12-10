import { Component, ElementRef, HostListener, OnInit, output, viewChild } from '@angular/core';
import { SwipeListControlComponent } from './swipe-list-control.component';

@Component({
    standalone: false,
    selector: 'app-swipe-control',
    templateUrl: './swipe-control.component.html',
    styleUrls: ['./swipe-control.component.scss']
})
export class SwipeControlComponent {

    private readonly leftItemsRef = viewChild<ElementRef<HTMLDivElement>>('leftBox');
    private readonly rightItemsRef = viewChild<ElementRef<HTMLDivElement>>('rightBox');

   
    public left = 0;
    public readonly tapped = output();

    public parent: SwipeListControlComponent;

    private oldLeft = 0;
    private startX = 0;
    private isTouch = false;
    private isMouseDown = false;


    @HostListener('document:mouseup')
    public onMouseUp() {
        if (!this.isMouseDown) {
            return;
        }
        this.isMouseDown = false;
        this.onTouchEnd();
    }

    @HostListener('document:mousemove', ['$event'])
    public onMouseMove(e: MouseEvent) {
        if (!this.isMouseDown) {
            return;
        }
        this.touchMove(e.clientX);
    }

    public get boxStyle() {
        return {
            transform: `translateX(${this.left - this.leftWidth}px)`,
        };
    }

    public get bodyStyle() {
        if (this.left >= 0) {
            return {};
        }
        return {
            "padding-left": `${-this.left}px`
        };
    }

    private get leftWidth(): number {
        const ele = this.leftItemsRef()?.nativeElement;
        if (!ele) {
            return 0;
        }
        return ele.clientWidth || ele.offsetWidth;
    }
    private get rightWidth(): number {
        const ele = this.rightItemsRef()?.nativeElement;
        if (!ele) {
            return 0;
        }
        return ele.clientWidth || ele.offsetWidth;
    }

    public onMouseDown(e: MouseEvent) {
        this.isMouseDown = true;
        this.touchStart(e.clientX, e);
    }



    public onTouchStart(e: TouchEvent) {
        this.touchStart(e.targetTouches[0].clientX, e);
    }


    public onTouchMove(e: TouchEvent) {
        e.preventDefault();
        this.touchMove(e.targetTouches[0].clientX);
    }

    public onTouchEnd() {
        if (!this.isTouch) {
            this.animation(this.left, 0);
            this.tapped.emit();
            return;
        }
        // const diff = e.changedTouches[0].clientX - startX;
        if (this.left === 0) {
            return;
        }
        if (this.left > 0) {
            const width = this.leftWidth;
            this.animation(this.left, this.left * 3 > width ? width : 0);
            return;
        }
        const w = - this.rightWidth;
        this.animation(this.left, this.left * 3 < w ? w : 0);
    }

    private touchStart(x: number, e: Event) {
        e.preventDefault();
        this.parent.siblings(this).forEach(i => i.reset());
        this.oldLeft = this.left;
        this.isTouch = false;
        this.startX = x;
    }

    private touchMove(x: number) {
        this.isTouch = true;
        const diff = x - this.startX;
        if (this.oldLeft === 0) {
            if (diff < 0) {
                this.left = Math.max(diff, -this.rightWidth);
                return;
            }
            this.left = Math.min(diff, this.leftWidth);
            return;
        }
        if (this.oldLeft > 0) {
            if (diff > 0) {
                return;
            }
            this.left = Math.max(this.oldLeft + diff, 0);
            return;
        }
        if (diff < 0) {
            return;
        }
        this.left = Math.min(this.oldLeft + diff, 0);
    }

    private animation(
        start: number, end: number, endHandle?: () => void) {
        const diff = start > end ? -1 : 1;
        let step = 1;
        const handle = setInterval(() => {
            start += (step ++) * diff;
            if ((diff > 0 && start >= end) || (diff < 0 && start <= end)) {
                clearInterval(handle);
                this.left = end;
                if (typeof endHandle === 'function') {
                    endHandle();
                }
                return;
            }
            this.left = start;
        }, 16);
    }

    public reset() {
        if (this.left === 0) {
            return;
        }
        this.animation(this.left, 0);
    }
}
