import { Component, computed, ElementRef, output, signal, viewChild } from '@angular/core';
import { SwipeListControlComponent } from './swipe-list-control.component';
import { interval } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-swipe-control',
    templateUrl: './swipe-control.component.html',
    styleUrls: ['./swipe-control.component.scss']
})
export class SwipeControlComponent {

    private readonly leftItemsRef = viewChild<ElementRef<HTMLDivElement>>('leftBox');
    private readonly rightItemsRef = viewChild<ElementRef<HTMLDivElement>>('rightBox');

   
    public readonly left = signal(0);
    public readonly tapped = output();

    public parent: SwipeListControlComponent;

    private oldLeft = 0;


    public readonly boxStyle = computed(() => {
        const lastX = this.left();
        return {
            transform: `translateX(${lastX - this.leftWidth}px)`,
        };
    });

    public readonly bodyStyle = computed(() => {
        const lastX = this.left();
        if (lastX >= 0) {
            return {};
        }
        return {
            "padding-left": `${-lastX}px`
        };
    });

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
        this.parent?.touchStart(this, {x: e.clientX, y: e.clientY}, false);
    }

    public onTouchStart(e: TouchEvent) {
        const src = e.targetTouches[0];
        this.parent?.touchStart(this, {x: src.clientX, y: src.clientY}, false);
    }

    public touched() {
        this.animation(this.left(), 0);
        this.tapped.emit();
    }

    public touchEnd() {
        const lastX = this.left();
        if (lastX === 0) {
            return;
        }
        if (lastX > 0) {
            const width = this.leftWidth;
            this.animation(lastX, lastX * 3 > width ? width : 0);
            return;
        }
        const w = - this.rightWidth;
        this.animation(lastX, lastX * 3 < w ? w : 0);
    }

    public touchStart() {
        this.oldLeft = this.left();
    }

    public touchMove(offsetX: number) {
        if (this.oldLeft === 0) {
            if (offsetX < 0) {
                this.left.set(Math.max(offsetX, -this.rightWidth));
                return;
            }
            this.left.set(Math.min(offsetX, this.leftWidth));
            return;
        }
        if (this.oldLeft > 0) {
            if (offsetX > 0) {
                return;
            }
            this.left.set(Math.max(this.oldLeft + offsetX, 0));
            return;
        }
        if (offsetX < 0) {
            return;
        }
        this.left.set(Math.min(this.oldLeft + offsetX, 0));
    }

    private animation(
        start: number, end: number, endHandle?: () => void) {
        const diff = start > end ? -1 : 1;
        let step = 1;
        const handle = interval(16).subscribe(() => {
            start += (step ++) * diff;
            if ((diff > 0 && start >= end) || (diff < 0 && start <= end)) {
                handle.unsubscribe();
                this.left.set(end);
                if (typeof endHandle === 'function') {
                    endHandle();
                }
                return;
            }
            this.left.set(start);
        });
    }

    public reset() {
        const lastX = this.left();
        if (lastX=== 0) {
            return;
        }
        this.animation(lastX, 0);
    }
}
