import { Component } from '@angular/core';
import { DialogAnimation } from '../../../theme/constants/dialog-animation';
import { DialogPackage } from '../dialog.injector';
import { DialogService } from '../dialog.service';
import { DialogConfirmOption } from '../model';
import { AnimationEvent } from '@angular/animations';

@Component({
    standalone: false,
    selector: 'app-dialog-confirm',
    templateUrl: './dialog-confirm.component.html',
    styleUrls: ['./dialog-confirm.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class DialogConfirmComponent {

    public title = '';
    public icon = '';
    public content = '';
    public confirmText = '';
    public cancelText = '';
    public visible = true;

    constructor(
        private data: DialogPackage<DialogConfirmOption>,
        private service: DialogService,
    ) {
        const option = data.data;
        this.title = option.title || $localize `Tip`;
        this.content = option.content || '';
        this.icon = option.icon || '';
        this.confirmText = option.confirmText || $localize `Ok`;
        this.cancelText = option.cancelText || $localize `Cancel`;
    }

    public close(result?: boolean) {
        this.visible = false;
        const option = this.data.data;
        if (result) {
            option.onConfirm && option.onConfirm();
        } else {
            option.onCancel && option.onCancel();
        }
    }

    public animationDone(event: AnimationEvent) {
        if (event.toState !== 'closed') {
            return;
        }
        this.service.remove(this.data.dialogId);
    }

}
