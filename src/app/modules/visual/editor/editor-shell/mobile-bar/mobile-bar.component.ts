import { Component, OnInit, input } from '@angular/core';
import { twoPad } from '../../../../../theme/utils';

@Component({
    standalone: false,
  selector: 'app-mobile-bar',
  templateUrl: './mobile-bar.component.html',
  styleUrls: ['./mobile-bar.component.scss']
})
export class MobileBarComponent {

    public readonly color = input('#fff');
    public readonly background = input('#000');
    public readonly title = input('首页');

    public get time() {
        const now = new Date();
        return [now.getHours(), now.getMinutes()].map(twoPad).join(':');
    }

    public get barStyle() {
        return {
            color: this.color(),
            background: this.background()
        };
    }

    constructor() { }

}
