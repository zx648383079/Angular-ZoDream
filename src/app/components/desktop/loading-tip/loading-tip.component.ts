import { Component, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-loading-tip',
    templateUrl: './loading-tip.component.html',
    styleUrls: ['./loading-tip.component.scss']
})
export class LoadingTipComponent {

    public readonly visible = input(true);
    public readonly loading = input(true);
    public readonly emptyIcon = input('');
    public readonly emptyTip = input($localize `Nothing is here.`);

    constructor() { }

}
