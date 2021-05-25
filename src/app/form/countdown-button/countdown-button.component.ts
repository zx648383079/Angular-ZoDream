import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-countdown-button',
  templateUrl: './countdown-button.component.html',
  styleUrls: ['./countdown-button.component.scss']
})
export class CountdownButtonComponent implements OnChanges {

    @Input() public time = 60;

    @Input() public label = '获取验证码';

    @Input() public againLabel = '重新获取';

    @Output() public tapped: EventEmitter<CountdownButtonComponent> = new EventEmitter();

    public text = this.label;

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
            time = this.time;
        }
        this.text = time.toString();
        this.handle = window.setInterval(() => {
            time--;
            if (time <= 0) {
                clearInterval(this.handle);
                this.disable = false;
                this.handle = 0;
                this.text = this.againLabel;
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
        this.text = this.label;
    }

}
