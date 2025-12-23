import {
  Component,
  effect,
  input,
  output,
  signal,
  untracked
} from '@angular/core';
import { CountdownEvent } from '../event';
import { interval, Subscription } from 'rxjs';
import { twoPad } from '../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-countdown-button',
    template: `<span>{{ text() }}</span>`,
    styleUrls: ['./countdown-button.component.scss'],
    host: {
        '[class.disabled]': "disabled()",
        '(click)': "tapClick()"
    }
})
export class CountdownButtonComponent implements CountdownEvent {

    public readonly time = input(60);
    public readonly label = input($localize `Get code`);
    public readonly againLabel = input($localize `Reacquire`);
    public readonly tapped = output<CountdownEvent>();
    public readonly text = signal('');

    public readonly disabled = signal(false);
    private $timer: Subscription;

    constructor() {
        effect(() => {
            if (this.disabled()) {
                return;
            }
            const label = this.label();
            untracked(() => {
                this.text.set(label);
            });
            
        });
    }

    public tapClick() {
        if (this.disabled()) {
            return;
        }
        this.tapped.emit(this);
    }

    public start(time: number = 0) {
        this.disabled.set(true);
        if (time < 1) {
            time = this.time();
        }
        this.text.set(twoPad(time));
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
        }
        this.$timer = interval(1000).subscribe(() => {
            time--;
            if (time <= 0) {
                this.$timer.unsubscribe();
                this.$timer = null;
                this.disabled.set(false);
                this.text.set(this.againLabel());
                return;
            }
            this.text.set(twoPad(time));
        });
    }

    public reset() {
        this.disabled.set(false);
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
        }
        this.text.set(this.label());
    }

}
