import {
  Component,
  input,
  model
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.scss'],
})
export class StarComponent implements FormValueControl<number> {

    public readonly disabled = input(true);
    public readonly labelVisible = input(false);
    public value = model(10);
    public items = [2, 4, 6, 8, 10];

    public tapChange(i: number) {
        if (this.disabled()) {
            return;
        }
        this.value.set(i);
    }
}
