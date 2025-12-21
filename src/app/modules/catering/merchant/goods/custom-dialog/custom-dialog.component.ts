import { Component, model, signal } from '@angular/core';
import { emptyValidate } from '../../../../../theme/validators';

type DialogConfirmFn = (value: string) => void;

@Component({
    standalone: false,
    selector: 'app-custom-dialog',
    templateUrl: './custom-dialog.component.html',
    styleUrls: ['./custom-dialog.component.scss'],
})
export class CustomDialogComponent {

    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public title = '名称';
    public readonly value = model('');
    private confirmFn: DialogConfirmFn;

    constructor() { }

    public open(confirm: DialogConfirmFn): void;
    public open(title: string, confirm: DialogConfirmFn): void;
    public open(title: string|DialogConfirmFn, confirm?: DialogConfirmFn) {
        if (typeof title === 'function') {
            this.confirmFn = title;
        } else if (title) {
            this.title = title;
            this.confirmFn = confirm;
        }
        this.visible.set(true);
    }

    public close(yes = false) {
        const value = this.value();
        if (yes && emptyValidate(value)) {
            return;
        }
        this.visible.set(false);
        if (yes && this.confirmFn) {
            this.confirmFn(value);
        }
    }
}
