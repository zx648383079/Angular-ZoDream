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
