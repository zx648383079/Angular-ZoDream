import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ButtonEvent, IButton } from '../event';

@Component({
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    selector: 'app-command-button',
    template: ``,
})
export class CommandButtonComponent implements IButton {

    @Input()
    public icon = '';

    @Input()
    public label = '';

    @Output() 
    public tapped = new EventEmitter<void>();


    public get name() {
        return this.label;
    }

    public onTapped(event: ButtonEvent) {
        this.tapped.emit();
    }
}
