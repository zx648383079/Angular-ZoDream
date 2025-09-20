import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogActionFn, DialogCheckFn, DialogConfirmFn, DialogEvent } from '../model';

@Component({
    standalone: false,
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements DialogEvent {

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
     * 整体高度
     */
    @Input() public height = 400;

    @Input() public width = 0;

    /**
     * 底部按钮是否显示
     */
    @Input() public buttonVisible = true;
    @Input() public footerVisible = true;
    @Input() public confirmText = $localize `Ok`;
    @Input() public cancelText =  $localize `Cancel`;
    /**
     * 内容框是否滚动，false 设置的高度将无效
     */
    @Input() public scrollable = true;
    /**
     * 全屏，高度设置失效
     */
    @Input() public fullscreen = false;
    /**
     * 验证方法
     */
    @Input() public checkFn: DialogCheckFn;
    /**
     * 确认事件
     */
    @Input() public confirmFn: DialogConfirmFn;
    @Input() public actionFn: DialogActionFn;
    public invalidTip = '';
    @Output() public confirm = new EventEmitter();
    private asyncHandler = 0;

    constructor() { }

    get boxStyle() {
        if (this.fullscreen) {
            return {
                width: '100%',
                left: 0,
                'margin-left': 0,
                top: 0,
                bottom: 0,
                right: 0,
                'margin-top': 0,
            };
        }
        const res: any = {};
        if (this.width > 0 && this.width < window.innerWidth) {
            res.width = this.width + 'px';
            res['margin-left'] = (- this.width / 2) + 'px';
        }
        if (!this.scrollable) {
            res['margin-top'] = '-30vh';
            return res;
        }
        res.height = this.height + 'px';
        res['margin-top'] = (- this.height / 2) + 'px';
        return res;
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
        if (!this.formatCheck()) {
            return;
        }
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn();
        }
        this.confirm.emit();
    }

    public open(): void;
    public open(confirm: () => void): void;
    public open(confirm: () => void, check: DialogCheckFn): void;
    public open(confirm: () => void, title: string): void;
    public open(confirm: () => void, check: DialogCheckFn, title: string): void;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open(cb?: () => void, check?: DialogCheckFn|string, title?: string) {
        if (typeof check === 'string') {
            [check, title] = [undefined, check];
        }
        if (cb) {
            this.actionFn = undefined;
        }
        this.checkFn = check as DialogCheckFn;
        this.confirmFn = cb;
        if (title) {
            this.title = title;
        }
        this.visible = true;
    }

    public openCustom(): void;
    public openCustom(cb: DialogActionFn): void;
    public openCustom(title: string): void;
    public openCustom(cb: DialogActionFn, title: string): void;
    /**
     * 显示弹窗并处理自定义按钮
     * @param cb 按钮事件，返回false表示不能关闭弹窗
     */
    public openCustom(cb?: DialogActionFn| string, title?: string) {
        if (typeof cb === 'string') {
            [cb, title] = [undefined, cb];
        }
        this.actionFn = cb as DialogActionFn;
        if (cb) {
            this.checkFn = undefined;
            this.confirmFn = undefined;
        }
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

    /**
     * 
     * @param msg 
     * @param time 
     */
    public asyncTip(msg: string|any, time = 3000) {
        if (this.asyncHandler > 0) {
            clearTimeout(this.asyncHandler);
        }
        this.invalidTip = msg;
        if (!msg) {
            return;
        }
        this.asyncHandler = window.setTimeout(() => {
            this.invalidTip = '';
        }, time);
    }

    private formatCheck(): boolean {
        if (!this.checkFn) {
            return true;
        }
        const res = this.checkFn();
        let success = true;
        let msg = '';
        if (typeof res === 'boolean') {
            success = res;
            if (!res) {
                msg = $localize `Something is invalid`;
            }
        } else {
            success = !res;
            if (!success) {
                msg = res;
            }
        }
        this.asyncTip(msg);
        return success;
    }

}