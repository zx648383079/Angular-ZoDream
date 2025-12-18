import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { ButtonEvent, IButton } from '../event';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-command-button',
    template: ``,
})
export class CommandButtonComponent implements IButton {

    public readonly icon = '';
    public readonly label = input('');
    public readonly tapped = output<void>();
    public disabled = false;

    public get name() {
        return this.label();
    }

    public onTapped(event: ButtonEvent) {
        this.tapped.emit();
    }
}
