import {
  Component,
  computed,
  input,
  model
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { parseNumber } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements FormValueControl<boolean|number|string> {

    public readonly label = input('');
    public readonly offLabel = input('');
    public readonly onLabel = input('');

    public readonly value = model<boolean|number|string>(false);
    public readonly disabled = input(false);

    public readonly labelContent = computed(() => {
        if (this.isActive()) {
            return this.onLabel() || this.label();
        }
        return this.offLabel() || this.label();
    });

    public readonly isActive = computed(() => {
        const value = this.value();
        if (typeof value === 'boolean') {
            return value;
        }
        return parseNumber(value) > 0;
    });

    public tapToggle() {
        if (this.disabled()) {
            return;
        }
        this.value.update(v => {
            if (typeof v === 'boolean') {
                return !v;
            }
            return parseNumber(v) > 0 ? 0 : 1;
        });
    }
}
