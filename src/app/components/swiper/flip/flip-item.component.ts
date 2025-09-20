import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { FlipContainerComponent } from './flip-container.component';

@Component({
    standalone: false,
    selector: 'app-flip-item',
    encapsulation: ViewEncapsulation.None,
    template: `
    @if (header) {
        <div class="flip-router-bar">
            @if (backable) {
                <i class="iconfont icon-arrow-left" (click)="tapBack()"></i>
            }
            <span>{{ header }}</span>
        </div>
    }
    
<ng-content></ng-content>`,
    styles: [''],
    host: {
        class: 'flip-item',
    }
})
export class FlipItemComponent {

    @Input() public header = '';
    public backable = false;
    @HostBinding('style')
    public boxStyle: any = {};
    public parent: FlipContainerComponent;
    
    public tapBack() {
        this.parent?.back();
    }

}
