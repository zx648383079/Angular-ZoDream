import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogAnimation } from '../../theme/constants/dialog-animation';


@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
    animations: [
        DialogAnimation,
    ],
})
export class DialogBoxComponent {

    /**
     * 标题
     */
    @Input() public title: string;
    @Input() public customHeader = false;
    /**
     * 是否显示
     */
    @Input() public visible = false;
    /**
     * 不显示还是动画
     */
    @Input() public collaspse = false;
    /**
     * 整体高度
     */
    @Input() public height = 400;
    /**
     * 底部按钮是否显示
     */
    @Input() public buttonVisible = true;
    @Input() public confirmText = '确定';
    @Input() public cancelText = '取消';
    /**
     * 验证方法
     */
    @Input() public checkFn: () => boolean;
    /**
     * 确认事件
     */
    @Input() public confirmFn: () => void;
    @Input() public actionFn: (data: any) => any;
    @Output() public confirm = new EventEmitter();

    constructor() { }

    get boxStyle() {
        return {
            height: this.height + 'px',
            'margin-top': (- this.height / 2) + 'px'
        };
    }

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
        if (this.actionFn && this.actionFn(result) === false) {
            return;
        }
        if (!result) {
            this.visible = false;
            return;
        }
        if (this.checkFn && !this.checkFn()) {
            return;
        }
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn();
        }
        this.confirm.emit();
    }

    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open(cb?: () => void, check?: () => boolean, title?: string) {
        this.checkFn = check;
        this.confirmFn = cb;
        if (title) {
            this.title = title;
        }
        this.visible = true;
    }

    /**
     * 显示弹窗并处理自定义按钮
     * @param cb 按钮事件，返回false表示不能关闭弹窗
     */
    public openCustom(cb?: (data: any) => any, title?: string) {
        this.actionFn = cb;
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
        if (e.code !== 'Enter') {
            return;
        }
        this.close((e.target as HTMLInputElement).value);
    }

}