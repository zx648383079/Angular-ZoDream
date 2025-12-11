import {
  Component,
  input,
  model
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements FormValueControl<boolean> {

    public readonly label = input('');
    public readonly offLabel = input('');
    public readonly onLabel = input('');

    public readonly value = model<boolean>(false);
    public disabled = input(false);

    public get labelContent(): string {
        if (this.isActive) {
            return this.onLabel() || this.label();
        }
        return this.offLabel() || this.label();
    }

    public get isActive(): boolean {
        const value = this.value();
        if (typeof value === 'boolean') {
            return value;
        }
        return value > 0;
    }

    public tapToggle() {
        if (this.disabled()) {
            return;
        }
        this.value.update(v => typeof v === 'boolean' ? !v : v > 0);
    }
}
