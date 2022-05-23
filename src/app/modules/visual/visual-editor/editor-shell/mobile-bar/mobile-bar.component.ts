import { Component, Input, OnInit } from '@angular/core';
import { twoPad } from '../../../../../theme/utils';

@Component({
  selector: 'app-mobile-bar',
  templateUrl: './mobile-bar.component.html',
  styleUrls: ['./mobile-bar.component.scss']
})
export class MobileBarComponent {

    @Input() public color = '#fff';
    @Input() public background = '#000';
    @Input() public title = '首页';

    public get time() {
        const now = new Date();
        return [now.getHours(), now.getMinutes()].map(twoPad).join(':');
    }

    public get barStyle() {
        return {
            color: this.color,
            background: this.background
        };
    }

    constructor() { }

}
