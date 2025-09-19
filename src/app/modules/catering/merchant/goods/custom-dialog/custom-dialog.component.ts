import { Component, Input } from '@angular/core';
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
    @Input() public visible = false;
    @Input() public title = '名称';
    @Input() public value = '';
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
        this.visible = true;
    }

    public close(yes = false) {
        if (yes && emptyValidate(this.value)) {
            return;
        }
        this.visible = false;
        if (yes && this.confirmFn) {
            this.confirmFn(this.value);
        }
    }
}
