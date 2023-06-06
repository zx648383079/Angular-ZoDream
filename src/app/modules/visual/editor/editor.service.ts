import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { cloneObject } from '../../../theme/utils';
import { controlSource } from './editor-widget/control';
import { inputSource } from './editor-widget/input';
import { panelSource } from './editor-widget/panel';
import { PanelWidget, Widget, WidgetMoveEvent, WidgetPreview, WidgetSource, WidgetType, ICatalogItem, IWorkEditor, IShellBound } from './model';
import { scaleBound } from './util';
import { ISize, IBound, IPoint } from '../../../theme/canvas';

@Injectable({
    providedIn: 'root'
})
export class EditorService {

    /**
     * 主窗口变化事件
     */
    public readonly windowSize$ = new BehaviorSubject<ISize>(null);
    /**
     * 整个编辑器的区域，绝对坐标
     */
    public readonly editorSize$ = new BehaviorSubject<IBound>(null);
    /**
     * 编辑区域，绝对坐标
     */
    public readonly workspaceSize$ = new BehaviorSubject<IBound>(null);
    /**
     * 编辑区域，相对 workspaceSize，不包括标尺的尺寸
    */
    public readonly workspaceInnerSize$ = new BehaviorSubject<IBound>(null);
    /**
     * 相对坐标，相对 workspaceSize
     */
    public readonly shellSize$ = new BehaviorSubject<IShellBound>(null);

    public readonly mouseMove$ = new Subject<IPoint>();
    public readonly mouseUp$ = new Subject<IPoint>();
    private mouseMoveListeners = {
        move: undefined,
        finish: undefined,
    };

    public readonly catalogItems$ = new BehaviorSubject<ICatalogItem[]>([]);
    // 当前自由面板内的组件列表内容
    public readonly widgetCellItems$ = new BehaviorSubject<Widget[]>([]);

    /**
     * 拖拽创建控件
     */
    public readonly moveWidget$ = new Subject<WidgetMoveEvent>();

    /**
     * 编辑控件
     */
    public readonly selectionChanged$ = new BehaviorSubject<Widget[]>([]);

    public readonly widgetItems = [...controlSource, ...inputSource, ...panelSource];

    public workspace: IWorkEditor;

    constructor() {
        this.mouseMove$.subscribe(res => {
            if (this.mouseMoveListeners.move) {
                this.mouseMoveListeners.move(res);
            }
        });
        this.mouseUp$.subscribe(res => {
            if (this.mouseMoveListeners.finish) {
                this.mouseMoveListeners.finish(res);
            }
        });
    }

    public get hasMoveListener() {
        return typeof this.mouseMoveListeners.move !== 'undefined';
    }

    public mouseMove(move?: (p: IPoint) => void, finish?: (p: IPoint) => void) {
        this.mouseMoveListeners = {
            move,
            finish: !move && !finish ? undefined : (p: IPoint) => {
                this.mouseMoveListeners = {move: undefined, finish: undefined};
                finish && finish(p);
            },
        };
    }

    /**
     * 获取唯一值
     */
    public uniqueId(): string;
    public uniqueId(isStr: false): number;
    public uniqueId(isStr = true): string | number {
        return isStr ? `zre${new Date().getTime()}` : new Date().getTime();
    };

    public pushWidget(...items: Widget[]) {
        const data = this.widgetCellItems$.value;
        items.forEach((item, i) => {
            item.id = this.uniqueId() + i;
            data.push(item);
        });
        this.widgetCellItems$.next(data);
        
    }

    public removeWidget(...items: Widget[]) {
        const data = this.widgetCellItems$.value;
        this.widgetCellItems$.next(data.filter(i => {
            for (const item of items) {
                if (item.id === i.id) {
                    return false;
                }
            }
            return true;
        }));
    }

    public copyWidget(...items: Widget[]) {
        this.pushWidget(...items.map(i => {
            return this.newWidget(i);
        }));
    }

    public pushCatalog(...items: ICatalogItem[]) {
        const data = this.catalogItems$.value;
        items.forEach((item, i) => {
            data.push(item);
        });
        this.catalogItems$.next(data);
    }

    /**
     * 判断是否在zoom中
     * @param p 
     * @returns 
     */
    public inZoom(p: IPoint): boolean {
        const res = this.workspaceSize$.value;
        if (!res) {
            return false;
        }
        return p.x >= res.x && p.y >= res.y &&
            p.x < res.x + res.width && 
            p.y < res.y + res.height;
    }

    /**
     * 转化坐标
     * @param p 
     * @param clone 是否需要新建对象，默认直接改变
     * @returns 
     */
    public zoomLocation<T extends IPoint>(p: T, clone = false): T {
        const obj = clone ? cloneObject(p) : p;
        const res = this.workspaceSize$.value;
        if (!res) {
            return obj;
        }
        obj.x -= res.x;
        obj.y -= res.y;
        return obj;
    }

    /**
     * 计算位置，并同时更新实际尺寸
     * @param size 
     * @param scale 
     * @returns 
     */
    public computeShellBound(size: IBound, scale: number): void {
        const workspace = this.workspaceInnerSize$.value;
        if (!workspace) {
            return;
        }
        const s = scale / 100;
        const maxWidth = workspace.width / s;
        const maxHeight = workspace.height / s;
        if (size.width < maxWidth) {
            size.x = (maxWidth - size.width) / 2;
        } else {
            size.x = Math.min(0, Math.max(maxWidth - size.width, size.x));
        }
        if (size.height < maxHeight) {
            size.y = (maxHeight - size.height) / 2;
        } else {
            size.y = Math.min(0, Math.max(maxHeight - size.height, size.y));
        }
        this.shellSize$.next({
            size,
            scale,
            actualSize: scaleBound(size, s)
        });
    }

    public newWidget(item: WidgetPreview): Widget {
        const source = this.findSource(item);
        let instance = this.newWidgetType(source);
        instance.onInit(source);
        if (source.onInit) {
            source.onInit(instance);
        }
        return instance;
    }

    private newWidgetType(source: WidgetSource): Widget {
        if (source.type === WidgetType.PANEL) {
            return new PanelWidget();
        }
        return new Widget();
    }

    private findSource(source: WidgetPreview): WidgetSource {
        const keys = ['name', 'tag', 'icon', 'preview'];
        for (const item of this.widgetItems) {
            let success = true;
            for (const key of keys) {
                if (item[key] !== source[key]) {
                    success = false;
                    break;
                }
            }
            if (success) {
                return item;
            }
        }
        throw new Error('widget not found!');
    }
}
