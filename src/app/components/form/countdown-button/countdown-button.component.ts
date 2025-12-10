import {
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output
} from '@angular/core';
import { CountdownEvent } from '../event';

@Component({
    standalone: false,
  selector: 'app-countdown-button',
  templateUrl: './countdown-button.component.html',
  styleUrls: ['./countdown-button.component.scss']
})
export class CountdownButtonComponent implements OnChanges, CountdownEvent {

    public readonly time = input(60);

    public readonly label = input($localize `Get code`);

    public readonly againLabel = input($localize `Reacquire`);

    public readonly tapped = output<CountdownButtonComponent>();

    public text = this.label();

    public disable = false;

    public handle = 0;

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (this.disable) {
            return;
        }
        if (changes.label) {
            this.text = changes.label.currentValue;
        }
    }

    public tapClick() {
        if (this.disable) {
            return;
        }
        this.tapped.emit(this);
    }

    public start(time: number = 0) {
        this.disable = true;
        if (time < 1) {
            time = this.time();
        }
        this.text = time.toString();
        this.handle = window.setInterval(() => {
            time--;
            if (time <= 0) {
                clearInterval(this.handle);
                this.disable = false;
                this.handle = 0;
                this.text = this.againLabel();
                return;
            }
            this.text = time.toString();
        }, 1000);
    }

    public reset() {
        if (this.disable) {
            this.disable = false;
        }
        if (this.handle > 0) {
            clearInterval(this.handle);
        }
        this.handle = 0;
        this.text = this.label();
    }

}
