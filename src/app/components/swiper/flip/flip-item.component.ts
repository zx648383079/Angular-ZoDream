import { Component, HostBinding, ViewEncapsulation, input } from '@angular/core';
import { FlipContainerComponent } from './flip-container.component';

@Component({
    standalone: false,
    selector: 'app-flip-item',
    encapsulation: ViewEncapsulation.None,
    template: `
    @if (header()) {
        <div class="flip-router-bar">
            @if (backable) {
                <i class="iconfont icon-arrow-left" (click)="tapBack()"></i>
            }
            <span>{{ header() }}</span>
        </div>
    }
    
<ng-content />`,
    styles: [''],
    host: {
        class: 'flip-item',
    }
})
export class FlipItemComponent {

    public readonly header = input('');
    public backable = false;
    @HostBinding('style')
    public boxStyle: any = {};
    public parent: FlipContainerComponent;
    
    public tapBack() {
        this.parent?.back();
    }

}
