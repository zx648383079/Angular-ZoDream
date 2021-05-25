import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogAnimation } from '../../theme/constants/dialog-animation';


type CheckFn = () => boolean;
type ConfirmFn = () => void;
type ActionFn = (data: any) => any;

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
    @Input() public confirmFn: ConfirmFn;
    @Input() public actionFn: ActionFn;
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

    public open(): void;
    public open(confirm: () => void): void;
    public open(confirm: () => void, check: CheckFn): void;
    public open(confirm: () => void, title: string): void;
    public open(confirm: () => void, check: CheckFn, title: string): void;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    public open(cb?: () => void, check?: CheckFn|string, title?: string) {
        if (typeof check === 'string') {
            [check, title] = [undefined, check];
        }
        this.checkFn = check as CheckFn;
        this.confirmFn = cb;
        if (title) {
            this.title = title;
        }
        this.visible = true;
    }

    public openCustom(): void;
    public openCustom(cb: ActionFn): void;
    public openCustom(title: string): void;
    public openCustom(cb: ActionFn, title: string): void;
    /**
     * 显示弹窗并处理自定义按钮
     * @param cb 按钮事件，返回false表示不能关闭弹窗
     */
    public openCustom(cb?: ActionFn| string, title?: string) {
        if (typeof cb === 'string') {
            [cb, title] = [undefined, cb];
        }
        this.actionFn = cb as ActionFn;
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