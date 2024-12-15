import { Component, Input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-dialog-popup',
    template: ` <div class="popup-arrow"></div>
    <div class="popup-body"><ng-content></ng-content></div>`,
    styles: [],
    host: {
        '[class]': '"dialog-popup dialog-popup-" + placement',
    }
})
export class DialogPopupComponent {

    @Input() public placement = 'left';

    constructor() { }

}
