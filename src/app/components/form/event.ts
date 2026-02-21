import { InputSignal, WritableSignal } from '@angular/core';
import { IUploadResult } from '../../theme/models/open';
import { IItem } from '../../theme/models/seo';
import { ArraySource } from './sources/ArraySource';

export interface IButton {
    name: string;
    icon: string;
    color?: string;
    disabled?: boolean;
    onTapped?: (event: ButtonEvent) => void;
}

export interface IButtonControl {
    label: InputSignal<string>;
    icon: InputSignal<string>;
    disabled: InputSignal<boolean>;
    theme: InputSignal<string>;
    onTapped?: (event: ButtonEvent) => void;
}

export interface ButtonGroupEvent extends ButtonEvent {
    data: IButton;
    index: number;
}

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

export interface SuggestEvent {
    suggest(items: any[]): void;
}

export interface SuggestChangeEvent extends SuggestEvent {
    text: string;
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

export interface IFormInput {
    type: string;
    name: string;
    label: string;
    items?: IItem[];
    value: any;
    required?: boolean;
    optionSource?: ArraySource;
}

export interface IControlOption {
    checked?: boolean;
    disabled?: boolean;
	marked?: boolean;
    created?: boolean;
	name?: string;
	value?: string | any;
}

export interface FormPanelEvent {
    get items(): WritableSignal<IFormInput[]>;
    value(): any;
    valid(): boolean;
    invalid(): boolean;
}