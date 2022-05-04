import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { cloneObject } from '../../theme/utils';
import { controlSource } from './editor-widget/control';
import { inputSource } from './editor-widget/input';
import { panelSource } from './editor-widget/panel';
import { PanelWidget, Widget, WidgetMoveEvent, WidgetPreview, WidgetSource, WidgetType, ICatalogItem, IPoint, IResetEvent, IWorkEditor } from './model';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

    /**
     * 主窗口变化事件
     */
    public readonly resize$ = new BehaviorSubject<IResetEvent|null>(null);
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

    public workEditor: IWorkEditor;

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
        const res = this.resize$.value;
        if (!res || !res.zoom) {
            return false;
        }
        return p.x >= res.zoom.x && p.y >= res.zoom.y &&
            p.x < res.zoom.x + res.zoom.width && 
            p.y < res.zoom.y + res.zoom.height;
    }

    /**
     * 转化坐标
     * @param p 
     * @param clone 是否需要新建对象，默认直接改变
     * @returns 
     */
    public zoomLocation<T extends IPoint>(p: T, clone = false): T {
        const obj = clone ? cloneObject(p) : p;
        const res = this.resize$.value;
        if (!res || !res.zoom) {
            return obj;
        }
        obj.x -= res.zoom.x;
        obj.y -= res.zoom.y;
        return obj;
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
