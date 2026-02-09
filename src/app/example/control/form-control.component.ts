import { Component, effect, signal } from '@angular/core';
import { ButtonEvent, DateSource } from '../../components/form';

@Component({
    standalone: false,
    selector: 'app-example-form-control',
    templateUrl: './form-control.component.html',
    styleUrls: ['./form-control.component.scss']
})
export class ExampleFormControlComponent {
    public value = '';
    public readonly inputValue = signal('');
    public readonly source = new DateSource();

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
