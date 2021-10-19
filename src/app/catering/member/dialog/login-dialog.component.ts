import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../../theme/constants';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class LoginDialogComponent {

    /**
     * 是否显示
     */
     @Input() public visible = false;

    constructor() { }

    public open() {
        this.visible = true;
    }

    public close() {
        this.visible = false;
    }
}
