import { Type } from '@angular/core';
import { IEditorModal, IEditorRange } from '../model';
import { IEditorContainer } from './editor';
import { EDITOR_ADD_TOOL, EDITOR_CLOSE_TOOL, EDITOR_ENTER_TOOL, EDITOR_MORE_TOOL } from './event';
import { EditorModules } from './module';
import { IUploadResult } from '../../../theme/models/open';
import { Observable, Subject } from 'rxjs';

type UploadFileCallback = (files: File[]|File|FileList) => Observable<IUploadResult[]|IUploadResult>;

export interface IEditorOption {
    undoCount?: number; // 最大回退步骤
    blockTag?: string,
    icons?: {
        [module: string]: string;
    },
    hiddenModules?: string[]|string;
    visibleModules?: string[]|string;
    toolbar?: {
        left?: string[]|string,
        right?: string[]|string,
    };
    uploader?: {
        image?: UploadFileCallback;
        video?: UploadFileCallback;
        file?: UploadFileCallback;
    } | UploadFileCallback;
}


export interface IEditorOptionItem {
    name: string|number;
    value: any;
    style?: any;
}

interface IEditorToolStatus {
    name: string;
    disabled?: boolean;
    actived?: boolean;
}

export interface IEditorTool extends IEditorToolStatus {
    icon: string;
    label: string;
    hotKey?: string;
}

export interface IEditorModule extends IEditorTool {
    parent?: string;
    modal?: Type<IEditorModal>;
    handler?: (editor: IEditorContainer, range?: IEditorRange, data?: any) => void;
}

export class EditorOptionManager {

    private option: IEditorOption = {
        undoCount: 10,
        blockTag: 'p',
        toolbar: {
            left: ['text', 'paragraph', 'add'],
            right: ['undo', 'redo', 'more']
        }
    };
    private moduleItems: {
        [key: string]: IEditorModule
    } = {};

    public toolUpdated$ = new Subject<IEditorToolStatus[]>();

    constructor() {
        this.push(...EditorModules);
    }

    public get leftToolbar(): IEditorTool[] {
        return this.filterTool(this.option.toolbar.left as any);
    }

    public get rightToolbar(): IEditorTool[] {
        return this.filterTool(this.option.toolbar.right as any);
    }

    public get closeTool(): IEditorTool {
        return this.toolOnly(EDITOR_CLOSE_TOOL);
    }

    public get addTool(): IEditorTool {
        return this.toolOnly(EDITOR_ADD_TOOL);
    }

    public get enterTool(): IEditorTool {
        return this.toolOnly(EDITOR_ENTER_TOOL);
    }

    public get blockTag(): string {
        return this.get('blockTag');
    }

    public get maxUndoCount() {
        return this.get('undoCount');
    }

    public set(key: string, value: any) {
        this.option[key] = value;
    }

    public merge(option: IEditorOption) {
        for (const key in option) {
            if (Object.prototype.hasOwnProperty.call(option, key)) {
                if (typeof this.option[key] !== 'object') {
                    this.option[key] = option[key];
                }
            }
        }
        ['icons', 'uploader'].forEach(k => {
            if (Object.prototype.hasOwnProperty.call(option, k) && typeof option[k] === 'object') {
                this.option[k] = this.mergeObject(this.option[k], option[k]);
            }
        });
        this.option.hiddenModules = this.strToArr(option.hiddenModules);
        this.option.visibleModules = this.strToArr(option.visibleModules);
        if (option.toolbar) {
            this.option.toolbar = {
                left: this.strToArr(option.toolbar.left),
                right: this.strToArr(option.toolbar.right)
            };
        }
    }

    public get(optionKey: string): any {
        return this.option[optionKey];
    }

    public toolOnly(name: string): IEditorTool {
        return this.toTool(this.moduleItems[name]);
    }

    public tool(...names: string[]): IEditorTool[] {
        const items = [];
        for (const name of names) {
            if (Object.prototype.hasOwnProperty.call(this.moduleItems, name) && this.isVisible(name)) {
                items.push(this.moduleItems[name]);
            }
        }
        return items;
    }

    public toolChildren(name: string): IEditorTool[] {
        const items = [];
        for (const key in this.moduleItems) {
            if (Object.prototype.hasOwnProperty.call(this.moduleItems, key) && this.moduleItems[key].parent == name && this.isVisible(key)) {
                items.push(this.moduleItems[key]);
            }
        }
        return items;
    }

    public push(...modules: IEditorModule[]) {
        for (const item of modules) {
            this.moduleItems[item.name] = item;
        }
    }

    public toolToggle(modules: string[], active: boolean): void;
    public toolToggle(name: string, active: boolean): void;
    public toolToggle(items: string[]|string, active: boolean): void {
        if (typeof items === 'string') {
            items = [items];
        }
        let isSystem = true;
        for (const item of items) {
            if (!this.isSystemTool(item)) {
                isSystem = false;
                break;
            }
        }
        const updated: IEditorToolStatus[] = [];
        if (!isSystem) {
            this.moduleMap(item => {
                if (items.indexOf(item.name) >= 0) {
                    if (!this.isBoolEqual(item.actived, active)) {
                        item.actived = active;
                        updated.push(item);
                    }
                    return;
                }
                if (!item.actived || this.isSystemTool(item)) {
                    return;
                }
                item.actived = false;
                updated.push(item);
            });
        } else {
            for (const item of items) {
                const module = this.moduleItems[item];
                if (this.isBoolEqual(module.actived, active)) {
                    continue;
                }
                module.actived = active;
                updated.push(module);
            }
        }
        this.toolUpdated$.next(updated);
    }

    public hotKeyModule(hotKey: string): IEditorTool|undefined {
        for (const key in this.moduleItems) {
            if (Object.prototype.hasOwnProperty.call(this.moduleItems, key) && this.moduleItems[key].hotKey == hotKey && this.isVisible(key)) {
                return this.moduleItems[key];
            }
        }
        return undefined;
    }

    public moduleMap(cb: (item: IEditorModule) => void|false) {
        for (const key in this.moduleItems) {
            if (!Object.prototype.hasOwnProperty.call(this.moduleItems, key)) {
                continue;
            }
            if (cb(this.moduleItems[key]) === false) {
                return;
            }
        }
    }

    public upload(files: File[]|FileList, type: 'image'|'video'|'file'): Observable<IUploadResult[]>;
    public upload(files: File, type: 'image'|'video'|'file'): Observable<IUploadResult>;
    public upload(files: any, type: 'image'|'video'|'file'): Observable<IUploadResult[]|IUploadResult> {
        const uploader = this.option.uploader;
        let func: UploadFileCallback = typeof uploader === 'function' ? uploader : undefined;
        if (typeof uploader === 'object') {
            func = uploader[type] ? uploader[type] : uploader.file;
        }
        if (!func) {
            return;
        }
        return func(files);
    }

    public toModule(module: string|IEditorTool): IEditorModule|undefined {
        if (typeof module === 'string') {
            return this.moduleItems[module];
        }
        if ((module as IEditorModule).handler) {
            return module;
        }
        if (module.name) {
            return this.moduleItems[module.name];
        }
        return module;
    }

    private filterTool(items?: string[]): IEditorTool[] {
        if (!items) {
            return [];
        }
        const data = [];
        for (const item of items) {
            if (this.isVisible(item) && Object.prototype.hasOwnProperty.call(this.moduleItems, item)) {
                data.push(this.toTool(this.moduleItems[item]));
            }
        }
        return data;
    }

    private toTool(item: IEditorTool): IEditorTool {
        return {
            name: item.name,
            label: item.label,
            icon: this.option.icons && Object.prototype.hasOwnProperty.call(this.option.icons, item.name) ? this.option.icons[item.name] : item.icon,
        };
    }

    private isVisible(module: string): boolean {
        if (this.option.hiddenModules && this.option.hiddenModules.indexOf(module) >= 0) {
            return false;
        }
        if (this.option.visibleModules) {
            return this.option.visibleModules.indexOf(module) >= 0;
        }
        return true;
    }

    private strToArr(data?: string[]|string): string[]|undefined {
        if (!data) {
            return undefined;
        }
        if (typeof data === 'object') {
            return data;
        }
        return data.split(' ').filter(i => !!i);
    }
 
    private mergeObject<T>(data: T, args: T): T {
        if (!data) {
            return args;
        }
        return Object.assign({}, data, args);
    }

    private isBoolEqual(a?: boolean, b?: boolean): boolean {
        if (a === true || b === true) {
            return a === b;
        }
        return false;
    }

    private isSystemTool(module: string|IEditorModule): boolean {
        if (typeof module === 'string') {
            module = this.moduleItems[module];
        }
        return !module.parent || module.parent === EDITOR_MORE_TOOL;
    }
}