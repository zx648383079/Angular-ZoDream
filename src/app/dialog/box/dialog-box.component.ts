import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogActionFn, DialogCheckFn, DialogConfirmFn, DialogEvent } from '../model';
import { DialogAnimation } from '../../theme/constants/dialog-animation';

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
    animations: [
        DialogAnimation,
    ],
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
    @Input() public checkFn: () => boolean;
    /**
     * 确认事件
     */
    @Input() public confirmFn: DialogConfirmFn;
    @Input() public actionFn: DialogActionFn;
    @Output() public confirm = new EventEmitter();

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
        if (!this.scrollable) {
            return {
                'margin-top': '-30vh',
            };
        }
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