import { EditorModules } from './module';

export interface IEditorOption {
    icons?: {
        [module: string]: string;
    },
    hiddenModules?: string[]|string;
    visibleModules?: string[]|string;
    toolbar?: {
        left?: string[]|string,
        right?: string[]|string,
    };
}

export interface IEditorTool {
    name: string;
    icon: string;
    disabled?: boolean;
    actived?: boolean;
    label: string;
}

export interface IEditorModule extends IEditorTool {
    parent?: string;
}

export class EditorOptionManager {

    private option: IEditorOption = {
        toolbar: {
            left: ['text', 'paragraph', 'add'],
            right: ['undo', 'redo', 'more']
        }
    };
    private moduleItems: {
        [key: string]: IEditorModule
    } = {};

    constructor() {
        this.push(...EditorModules);
    }

    public get leftToolbar(): IEditorTool[] {
        return this.filterTool(this.option.toolbar.left as any);
    }

    public get rightToolbar(): IEditorTool[] {
        return this.filterTool(this.option.toolbar.right as any);
    }
    
    public merge(option: IEditorOption) {
        if (option.icons) {
            this.option.icons = this.mergeObject(this.option.icons, option.icons);
        }
        this.option.hiddenModules = this.strToArr(option.hiddenModules);
        this.option.visibleModules = this.strToArr(option.visibleModules);
        if (option.toolbar) {
            this.option.toolbar = {
                left: this.strToArr(option.toolbar.left),
                right: this.strToArr(option.toolbar.right)
            };
        }
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

    private 

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
}