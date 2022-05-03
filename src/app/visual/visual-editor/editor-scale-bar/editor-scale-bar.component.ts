import { Component, EventEmitter, Input, Output } from '@angular/core';
import { checkRange } from '../../../theme/utils';

@Component({
  selector: 'app-editor-scale-bar',
  templateUrl: './editor-scale-bar.component.html',
  styleUrls: ['./editor-scale-bar.component.scss']
})
export class EditorScaleBarComponent {

    @Input() public orientation = false;
    @Input() public min = 30;
    @Input() public max = 300;
    @Input() public value = 100;
    @Input() public step = 10;
    @Output() public valueChange = new EventEmitter<number>();

    constructor() { }

    public get innerStyle() {
        const val = this.value - this.min;
        const len = this.max - this.min;
        const x = val * 100 / len;
        if (this.orientation) {
            return {
                left: x + '%',
            };
        }
        return {
            top: x + '%',
        };
    }

    public tapMinus() {
        this.output(this.value - this.step);
    }

    public tapPlus() {
        this.output(this.value + this.step);
    }

    private output(val: number) {
        val = checkRange(val, this.min, this.max);
        if (val == this.value) {
            return;
        }
        this.valueChange.emit(this.value = val);
    }
}
