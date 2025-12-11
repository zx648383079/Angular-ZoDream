import { Component, HostBinding, input, model } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-expand-card',
    templateUrl: './expand-card.component.html',
    styleUrls: ['./expand-card.component.scss'],
    host: {
        class: 'expand-card',
    }
})
export class ExpandCardComponent {

    @HostBinding('class.open')
    public readonly toggle = model(false);
    public readonly header = input('Header');


    public tapped() {
        this.toggle.update(v => !v);
    }
}
