import { Component, input } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-dialog-popup',
    template: ` <div class="popup-arrow"></div>
    <div class="popup-body"><ng-content /></div>`,
    styles: [],
    host: {
        '[class]': '"dialog-popup dialog-popup-" + placement()',
    }
})
export class DialogPopupComponent {

    public readonly placement = input('left');

}
