import { Component, computed, input } from '@angular/core';
import { Widget } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-button-control',
    templateUrl: './button-control.component.html',
    styleUrls: ['./button-control.component.scss']
})
export class ButtonControlComponent {

    public readonly value = input<Widget>();


    public readonly innerStyle = computed(() => {
        const value = this.value();
        if (!value) {
            return {};
        }
        return value.innerStyle;
    });

    public readonly innerCls = computed(() => {
        const value = this.value();
        if (!value) {
            return {};
        }
        return value.classList.toString();
    });


}
