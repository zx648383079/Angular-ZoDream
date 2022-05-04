import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../../../model';

@Component({
  selector: 'app-button-control',
  templateUrl: './button-control.component.html',
  styleUrls: ['./button-control.component.scss']
})
export class ButtonControlComponent {

    @Input() public value: Widget;


    public get innerStyle() {
        if (!this.value) {
            return {};
        }
        return this.value.innerStyle;
    }

    public get innerCls() {
        if (!this.value) {
            return {};
        }
        return this.value.classList.toString();
    }

    constructor() { }


}
