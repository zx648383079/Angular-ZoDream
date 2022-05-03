import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../../context-menu';
import { checkRange } from '../../../theme/utils';
import { BatchCommand, CommandManager, RemoveWeightCommand, ResizeCommand } from '../command';
import { EditorService } from '../editor.service';
import { IBound, IPoint, ISize, SelectionBound, Widget } from '../model';
import { boundFromScale, filterItems, isIntersect, isMergeable, isSplitable, pointFromScale, relativePoint, scaleBound, wordBound, wordRect } from '../util';
import * as menu from '../model/menu';

@Component({
  selector: 'app-editor-work-body',
  templateUrl: './editor-work-body.component.html',
  styleUrls: ['./editor-work-body.component.scss']
})
export class EditorWorkBodyComponent extends CommandManager {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;
    public scaleValue = 100;
    public shellBound: IBound = {
        x: 0,
        y: 0,
        width: 414,
        height: 600,
    };
    public trackData = {
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 100,
    };
    private selectionRect = new SelectionBound();
    
    constructor(
        private service: EditorService,
        public elementRef: ElementRef<HTMLDivElement>,
        private ngZone: NgZone,
    ) {
        super();
        this.service.commandManager = this;
        this.service.resize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.ngZone.run(() => {
                this.shellBound.x = Math.max(0, (res.zoom.width - this.shellBound.width) / 2);
                this.shellBound.y = Math.max(0, (res.zoom.height - this.shellBound.height) / 2);
                this.trackData.xMax = this.shellBound.x;
                this.trackData.xMin = - this.shellBound.width;
                this.trackData.yMax = this.shellBound.y;
                this.trackData.yMin = - this.shellBound.height;
            });
        });
    }

    public get shellScaleBound(): IBound {
        return scaleBound(this.shellBound, this.scaleValue, 100);
    }

    /**
     * 编辑区域的世界坐标
     */
    public get wordShellBound() {
        return wordRect(this.service.resize$.value ? this.service.resize$.value.zoom : undefined, this.shellBound);
    }


    public get widgetItems$() {
        return this.service.widgetCellItems$;
    }

    public get selectionStyle() {
        const bound = this.selectionRect.box;
        if (bound.width < 5 && bound.height < 5) {
            return {};
        }
        return {
            left: bound.x + 'px',
            top: bound.y + 'px',
            width: bound.width + 'px',
            height: bound.height + 'px',
            'z-index': 100,
        };
    }

    public get outerStyle() {
        // const base = this.wordShellBound;
        return {
            // 'transform-origin': `${base.x}px ${base.y}px`,
            transform: 'scale(' + (this.scaleValue / 100) +')',
        };
    }

    public get innerStyle() {
        return {
            width: this.shellBound.width + 'px',
            height: this.shellBound.height + 'px',
            left: this.shellBound.x + 'px',
            top: this.shellBound.y + 'px',
        };
        // return {
        //     width: this.hBar.innerLength + 'px',
        //     height: this.vBar.innerLength + 'px',
        //     transform: 'translate(' + (-this.hBar.innerOffset) +  'px, '+ (-this.vBar.innerOffset) +'px)',
        // };
    }

    /**
     * 转化为编辑区域坐标
     * @param point 
     * @returns 
     */
    public shellLocation<T extends IPoint>(point: T): T {
        if (this.scaleValue === 100) {
            return relativePoint(this.wordShellBound, point);
        }
        const zoom = this.service.resize$.value.zoom;
        return pointFromScale(relativePoint(zoom, point), this.shellBound, this.shellScaleBound);
    }

    public onResizing(e: IPoint) {
        let lastY = e.y;
        let oldValue: ISize = {width: this.shellBound.width, height: this.shellBound.height};
        this.service.mouseMove(event => {
            this.shellBound.height += event.y - lastY;
            lastY = event.y;
        }, p => {
            this.executeCommand(new ResizeCommand(this, oldValue, {
                width: this.shellBound.width,
                height: this.shellBound.height + p.y - lastY
            }));
        });
    }

    public onContext(e: MouseEvent, item?: Widget|boolean) {
        const items: Widget[] = item && item instanceof Widget ? [item] : (item === true ? this.service.selectionChanged$.value : filterItems(this.widgetItems$.value, this.shellLocation({x: e.clientX, y: e.clientY})));
        const navItems = items.length > 0 ? menu.EditorSelected(isMergeable(items), isSplitable(items)) : menu.EditorNotSelected;
        return this.contextMenu.show(e, navItems, menu => {
            if (menu.name === '删除' && item) {
                this.executeCommand(new BatchCommand(...items.map(i => new RemoveWeightCommand(this, i))));
            }
        });
    }

    public onMouseWhell(event: WheelEvent) {
        this.shellBound.x -= event.deltaX;
        this.shellBound.y -= event.deltaY;
    }

    public onSelectStart(event: MouseEvent) {
        if (this.service.hasMoveListener || event.button > 0) {
            return;
        }
        this.selectionRect.start = {
            x: event.clientX,
            y: event.clientY
        };
        this.service.mouseMove(event => {
            this.selectionRect.end = event;
        }, _ => {
            const bound = boundFromScale(this.shellLocation(this.selectionRect.box), this.scaleValue, 100);
            this.selectionRect.clear();
            const items = filterItems(this.widgetItems$.value, bound);
            console.log(bound, items, this.widgetItems$.value);
            
            this.service.selectionChanged$.next(items);
        });
    }

    public scale(value: number = this.scaleValue, offset?: number) {
        if (!offset) {
            value += offset;
        }
        this.scaleValue = checkRange(value, 30, 300);
    }

    public resize(size: ISize) {
        this.ngZone.run(() => {
            this.shellBound.height = size.height;
            this.shellBound.width = size.width;
        });
    }

    public push(weight: Widget, location?: IPoint) {
        if (!location && !this.inBound(location)) {
            return false;
        }
        if (location) {
            weight.location = this.shellLocation(location);
        }
        this.service.pushWidget(weight);
        return true;
    }

    public remove(weight: Widget) {
        this.service.removeWidget(weight);
    }

    private inBound(p: IPoint) {
        return isIntersect(this.wordShellBound, p);
    }
}
