import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-tip',
  templateUrl: './loading-tip.component.html',
  styleUrls: ['./loading-tip.component.scss']
})
export class LoadingTipComponent {

    @Input() public visible = true;
    @Input() public loading = true;
    @Input() public emptyIcon = '';
    @Input() public emptyTip = $localize `Nothing is here.`;

    constructor() { }

}
