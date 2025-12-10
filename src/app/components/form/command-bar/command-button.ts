import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { ButtonEvent, IButton } from '../event';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-command-button',
    template: ``,
})
export class CommandButtonComponent implements IButton {

    public readonly icon = input('');

    public readonly label = input('');

    public readonly tapped = output<void>();


    public get name() {
        return this.label();
    }

    public onTapped(event: ButtonEvent) {
        // TODO: The 'emit' function requires a mandatory void argument
        this.tapped.emit();
    }
}
