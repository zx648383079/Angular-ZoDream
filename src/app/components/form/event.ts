import { IUploadResult } from '../../theme/models/open';

export interface ButtonEvent {
    /**
     * 开始显示loading动画
     */
    enter(): void;
    /**
     * 恢复初始状态
     */
    reset(): void;
}

export interface CountdownEvent {
    /**
     * 开始显示倒计时
     */
    start(time?: number): void;
    /**
     * 恢复初始状态
     */
    reset(): void;
}

export interface UploadButtonEvent extends ButtonEvent {
    files: FileList;
}

export interface UploadCustomEvent {
    file: File;
    next: (data?: IUploadResult) => void;
}