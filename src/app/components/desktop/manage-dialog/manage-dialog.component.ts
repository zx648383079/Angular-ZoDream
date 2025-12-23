import { Component, input, model, signal } from '@angular/core';
import { ManageDialogEvent } from '../../../components/dialog';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-manage-dialog',
    templateUrl: './manage-dialog.component.html',
    styleUrls: ['./manage-dialog.component.scss'],
})
export class ManageDialogComponent implements ManageDialogEvent {

    /**
     * 标题
     */
    public readonly title = model($localize `Confirm execution of this operation?`);
    public readonly placeholder = input($localize `Please enter the operation note information`);
    /**
     * 是否显示
     */
    public readonly visible = signal(false);
    public readonly confirmText = input($localize `Ok`);
    public readonly cancelText = input($localize `Cancel`);

    public readonly dataForm = form(signal({
        remark: ''
    }));
    /**
     * 确认事件
     */
    private confirmFn: (data: any) => boolean|void;


    /**
     * 关闭弹窗
     * @param result 
     * @returns 
     */
    public close(result?: any) {
        if (typeof result === 'undefined') {
            this.visible.set(false);
            return;
        }
        if (!result) {
            this.visible.set(false);
            return;
        }
        if (this.confirmFn && this.confirmFn(this.dataForm().value()) === false) {
            return;
        }
        this.visible.set(false);
    }

    public open(confirm: (data: any) => boolean|void): void;
    public open(confirm: (data: any) => boolean|void, title: string): void;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open(confirm: (data: any) => boolean|void, title?: string) {
        this.confirmFn = confirm;
        if (title) {
            this.title.set(title);
        }
        this.visible.set(true);
    }


    /**
     * 绑定input的确认按键事件
     * @param e 
     * @returns 
     */
    public confirmClose(e: KeyboardEvent) {
        if (e.key !== 'Enter') {
            return;
        }
        this.close((e.target as HTMLInputElement).value);
    }

}
