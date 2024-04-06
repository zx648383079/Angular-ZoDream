import { Component, Input } from '@angular/core';
import { DialogAnimation } from '../../constants';
import { ManageDialogEvent } from '../../../components/dialog';

@Component({
    selector: 'app-manage-dialog',
    templateUrl: './manage-dialog.component.html',
    styleUrls: ['./manage-dialog.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class ManageDialogComponent implements ManageDialogEvent {

    /**
     * 标题
     */
    @Input() public title = $localize `Confirm execution of this operation?`;
    @Input() public placeholder = $localize `Please enter the operation note information`;
    /**
     * 是否显示
     */
    @Input() public visible = false;
    /**
     * 不显示还是动画
     */
    @Input() public collaspse = false;
    @Input() public confirmText = $localize `Ok`;
    @Input() public cancelText =  $localize `Cancel`;
    /**
     * 确认事件
     */
    private confirmFn: (data: any) => boolean|void;
    public data: any = {
        remark: ''
    };

    /**
     * 关闭弹窗
     * @param result 
     * @returns 
     */
    public close(result?: any) {
        if (typeof result === 'undefined') {
            this.visible = false;
            return;
        }
        if (!result) {
            this.visible = false;
            return;
        }
        if (this.confirmFn && this.confirmFn(this.data) === false) {
            return;
        }
        this.visible = false;
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
            this.title = title;
        }
        this.visible = true;
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
