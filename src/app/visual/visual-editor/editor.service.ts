import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { cloneObject } from '../../theme/utils';
import { controlSource } from './editor-widget/control';
import { inputSource } from './editor-widget/input';
import { panelSource } from './editor-widget/panel';
import { PanelWidget, Widget, WidgetMoveEvent, WidgetPreview, WidgetSource, WidgetType } from './model';
import { IActionItem, IPoint, IResetEvent } from './model/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

    /**
     * 主窗口变化事件
     */
    public resize$ = new BehaviorSubject<IResetEvent|null>(null);
    // 当前自由面板内的组件列表内容
    public widgetCellItems$ = new BehaviorSubject<Widget[]>([]);

    public moveWidget$ = new Subject<WidgetMoveEvent>();
    
    public action$ = new BehaviorSubject<boolean>(true);

    public readonly widgetItems = [...controlSource, ...inputSource, ...panelSource];

    /** 
     * 当前操作记录
     */
    private actionItems: IActionItem[] = [];
    /**
     * 当前所处的位置
     */
    private actionIndex = -1;

    constructor() { }


    /**
     * 是否能取消撤销操作
     */
    public canForward(): boolean {
        return this.actionIndex >= 0 && this.actionIndex < this.actionItems.length  - 1;
    }

    /**
     * 是否能撤销操作
     */
    public canBack(): boolean {
        return this.actionIndex >= 0;
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
        const res = this.resize$.value;
        if (!res || !res.zoom) {
            return;
        }
        const obj = clone ? cloneObject(p) : p;
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
        if (source.type === WidgetType.CONTROL) {
            return new Widget();
        }
        return new PanelWidget();
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
