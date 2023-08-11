import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { FlipContainerComponent } from './flip-container.component';

@Component({
    selector: 'app-flip-item',
    encapsulation: ViewEncapsulation.None,
    template: `<div class="flip-router-bar" *ngIf="header">
    <i class="iconfont icon-arrow-left" *ngIf="backable" (click)="tapBack()"></i>
    <span>{{ header }}</span>
</div>
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

    constructor() { }

    public tapBack() {
        this.parent?.back();
    }

}
