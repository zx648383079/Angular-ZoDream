import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-page-tip',
    templateUrl: './page-tip.component.html',
    styleUrls: ['./page-tip.component.scss']
})
export class PageTipComponent {

    @Input() public title = $localize `Tip`;

    public isMin = false;

    public tapMin() {
        this.isMin = !this.isMin;
    }

}
