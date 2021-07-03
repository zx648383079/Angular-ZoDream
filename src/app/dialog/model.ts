interface DialogOption {
    [key: string]: any;
    content?: string;   //内容
    closeAnimate?: boolean;
    target?: any;           // 载体 显示在那个内容上，默认全局, position 需要自己设置 relative、absolute、fixed
    onClosing?: () => any; // 关闭请求， 是否关闭， 返回false 为不关闭
}

export interface DialogTipOption extends DialogOption {
    time?: number;         //显示时间
}


export interface DialogConfirmOption extends DialogOption {
    title?: string;
    icon?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface DialogMessageOption extends DialogOption {
    time?: number;         //显示时间
    type?: 'success' | 'info' | 'error' | 'waining';
    title?: string;
}

export type DialogCheckFn = () => boolean;
export type DialogConfirmFn = () => void;
export type DialogActionFn = (data: any) => any;

export interface DialogEvent {
    /**
     * 关闭弹窗
     * @param result 
     */
    close(result?: any): void;
    /**
     * 显示弹窗
     */
    open(): void;
    open(confirm: () => void): void;
    open(confirm: () => void, check: DialogCheckFn): void;
    open(confirm: () => void, title: string): void;
    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     * @param check 判断是否允许关闭
     */
    open(confirm: () => void, check: DialogCheckFn, title: string): void;
    /**
     * 显示弹窗绑定自定义关闭事件
     */
    openCustom(): void;
    openCustom(cb: DialogActionFn): void;
    openCustom(title: string): void;
    /**
     * 显示弹窗并处理自定义按钮
     * @param cb 按钮事件，返回false表示不能关闭弹窗
     */
    openCustom(cb: DialogActionFn, title: string): void;
    /**
     * 绑定输入框事件，确认件关闭绑定input的确认按键事件
     * @param e 
     */
    confirmClose(e: KeyboardEvent)
}