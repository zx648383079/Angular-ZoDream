import { Component, input, output } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-editor-input-group',
    template: `
    <i class="control-updated-tag" [hidden]="isEmpty()" (click)="reset.emit()"></i>
    @if (header()) {
        <label>{{ header() }}</label>
    }
    <ng-content />
    `,
    styles: [],
})
export class EditorInputGroupComponent {
    public readonly header = input('');
    public readonly isEmpty = input(true);

    public readonly reset = output<void>();

}
