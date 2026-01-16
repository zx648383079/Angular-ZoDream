import { Component, effect, signal } from '@angular/core';
import { ButtonEvent } from '../../components/form';

@Component({
    standalone: false,
    selector: 'app-example-form-control',
    templateUrl: './form-control.component.html',
    styleUrls: ['./form-control.component.scss']
})
export class ExampleFormControlComponent {
    public value = '';
    public readonly inputValue = signal('');

    constructor() {
        effect(() => {
            console.log(this.inputValue());
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        e.enter();
        console.log([this.value, this.inputValue()]);
        setTimeout(() => {
            e?.reset();
        }, 2000);
    }
}
