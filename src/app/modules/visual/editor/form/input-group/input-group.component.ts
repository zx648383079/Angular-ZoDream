import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-editor-input-group',
    template: `
    <i class="control-updated-tag" [hidden]="isEmpty" (click)="reset.emit()"></i>
    <label *ngIf="header">{{ header }}</label>
    <ng-content></ng-content>
    `,
    styles: [],
})
export class EditorInputGroupComponent {
    @Input() public header = '';
    @Input() public isEmpty = true;

    @Output() public reset = new EventEmitter<void>();

}
