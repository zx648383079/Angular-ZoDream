import {
  Component,
  effect,
  input,
  output
} from '@angular/core';
import { CountdownEvent } from '../event';
import { interval, Subscription } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-countdown-button',
    templateUrl: './countdown-button.component.html',
    styleUrls: ['./countdown-button.component.scss']
})
export class CountdownButtonComponent implements CountdownEvent {

    public readonly time = input(60);
    public readonly label = input($localize `Get code`);
    public readonly againLabel = input($localize `Reacquire`);
    public readonly tapped = output<CountdownButtonComponent>();
    public text = this.label();

    public disabled = false;
    private $timer: Subscription;

    constructor() {
        effect(() => {
            if (this.disabled) {
                return;
            }
            this.text = this.label();
        });
    }

    public tapClick() {
        if (this.disabled) {
            return;
        }
        this.tapped.emit(this);
    }

    public start(time: number = 0) {
        this.disabled = true;
        if (time < 1) {
            time = this.time();
        }
        this.text = time.toString();
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
        }
        this.$timer = interval(1000).subscribe(() => {
            time--;
            if (time <= 0) {
                this.$timer.unsubscribe();
                this.$timer = null;
                this.disabled = false;
                this.text = this.againLabel();
                return;
            }
            this.text = time.toString();
        });
    }

    public reset() {
        if (this.disabled) {
            this.disabled = false;
        }
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
        }
        this.text = this.label();
    }

}
