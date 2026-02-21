import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { ButtonEvent, IButtonControl } from '../event';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-command-button',
    template: ``,
})
export class CommandButtonComponent implements IButtonControl {

    public readonly icon = input('');
    public readonly label = input('');
    public readonly tapped = output<void>();
    public readonly disabled = input(false);
    public readonly theme = input('');

    public onTapped(event: ButtonEvent) {
        this.tapped.emit();
    }
}
