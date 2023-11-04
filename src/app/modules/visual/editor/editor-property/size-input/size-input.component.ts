import { Component, HostBinding, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-editor-size-input',
    templateUrl: './size-input.component.html',
    styleUrls: ['./size-input.component.scss'],
    host: {
        class: 'select-with-control'
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditorSizeInputComponent),
        multi: true
    }]
})
export class EditorSizeInputComponent {

    @Input() public label = '';

    public unit = 'px';
    public visible = false;
    public unitItems: string[] = ['px', 'em', 'rem', 'vh', 'vw', '%', 'auto', 'none'];
    @HostBinding('class')
    public get ngClass() {
        return this.visible ? 'select-focus' : '';
    }

    public tapSelectedUnit(item: string) {
        this.unit = item;
        this.visible = false;
    }

}
