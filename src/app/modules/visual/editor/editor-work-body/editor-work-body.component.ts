import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../../../components/context-menu';
import { checkRange } from '../../../../theme/utils';
import { EditorService } from '../editor.service';
import { IWorkEditor, SelectionBound, Widget, IEditorAction, BatchCommand, CommandManager, RemoveWeightCommand, ResizeCommand, MENU_ACTION } from '../model';
import { boundFromScale, filterItems, isIntersect, isMergeable, isSplitable, pointFromScale, relativePoint, scaleBound, wordRect } from '../util';
import * as menu from '../model/menu';
import { EditorRulePanelComponent } from '../editor-rule-panel/editor-rule-panel.component';
import { IBound, IPoint, ISize } from '../../../../theme/canvas';

@Component({
  selector: 'app-editor-work-body',
  templateUrl: './editor-work-body.component.html',
  styleUrls: ['./editor-work-body.component.scss']
})
export class EditorWorkBodyComponent extends CommandManager implements IWorkEditor {

    @ViewChild(ContextMenuComponent)
    private contextMenu: ContextMenuComponent;
    @ViewChild(EditorRulePanelComponent)
    private rulePanel: EditorRulePanelComponent;
    public trackData = {
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 100,
    };
    public shellStyle: any = {};

    private selectionRect = new SelectionBound();
    
    constructor(
        private service: EditorService,
        public elementRef: ElementRef<HTMLDivElement>,
    ) {
        super();
        this.service.workspace = this;
        this.service.shellSize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.shellStyle = {
                width: res.size.width + 'px',
                height: res.size.height + 'px',
                transform: 'scale(' + (res.scale / 100) +') translate(' + res.size.x +'px, '+ res.size.y +'px)',
            };
        });
        this.service.workspaceInnerSize$.subscribe(res => {
            if (!res) {
                return;
            }
            let size: IBound = {
                x: 0,
                y: 0,
                width: 414,
                height: 600,
            };
            let scale = 100;
            if (this.service.shellSize$.value) {
                scale = this.service.shellSize$.value.scale;
                size = this.service.shellSize$.value.size;
            }
            this.service.computeShellBound(size, scale);
        });
        this.service.workspaceSize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.service.workspaceInnerSize$.next({
                x: 16,
                y: 16,
                width: res.width - 22.4,
                height: res.height - 22.4
            });
        });
    }

    /**
     * 编辑区域的世界坐标
     */
    public get wordShellBound() {
        const res = this.service.workspaceSize$.value;
        return wordRect(res, this.service.shellSize$.value.size);
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

    /**
     * 转化为编辑区域坐标
     * @param point 
     * @returns 
     */
    public getPosition<T extends IPoint>(point: T): T {
        const res = this.service.shellSize$.value;
        if (res.scale === 100) {
            return relativePoint(this.wordShellBound, point);
        }
        const zoom = this.service.workspaceSize$.value;
        const p = pointFromScale(point, res.size, res.scale, 100);
        return relativePoint(zoom, p);
    }

    public onResizing(e: IPoint) {
        let lastY = e.y;
        const shell = this.service.shellSize$.value.size;
        let oldValue: ISize = {width: shell.width, height: shell.height};
        this.service.mouseMove(event => {
            shell.height += event.y - lastY;
            lastY = event.y;
        }, p => {
            this.executeCommand(new ResizeCommand(this, oldValue, {
                width: shell.width,
                height: shell.height + p.y - lastY
            }));
        });
    }

    public onContext(e: MouseEvent, item?: Widget|boolean) {
        const items: Widget[] = item && item instanceof Widget ? [item] : (item === true ? this.service.selectionChanged$.value : filterItems(this.widgetItems$.value, this.getPosition({x: e.clientX, y: e.clientY})));
        const navItems = items.length > 0 ? menu.EditorSelected(isMergeable(items), isSplitable(items)) : menu.EditorNotSelected;
        return this.contextMenu.show(e, navItems, menu => {
            if (typeof menu.data === 'undefined') {
                return;
            }
            this.execute({
                action: menu.data,
                data: items
            });
        });
    }

    public onMouseWhell(event: WheelEvent) {
        const res = this.service.shellSize$.value;
        if (!res) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (event.ctrlKey) {
            this.scale(undefined, event.deltaY > 0 ? -10 : 10);
            return;
        }
        res.size.x -= event.deltaX;
        res.size.y -= event.deltaY;
        this.service.shellSize$.next({
            ...res, actualSize: scaleBound(res.size, res.scale, 100)
        });
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
            this.select(this.selectionRect.box);
            this.selectionRect.clear();
        });
    }

    public select(rect: IBound) {
        const bound = boundFromScale(this.getPosition(rect), this.service.shellSize$.value.scale, 100);
        const items = filterItems(this.widgetItems$.value, bound);
        this.service.selectionChanged$.next(items);
    }

    public scale(value?: number, offset?: number) {
        const res = this.service.shellSize$.value;
        if (!res) {
            return;
        }
        if (!value) {
            value = res.scale;
        }
        if (offset) {
            value += offset;
        }
        res.scale = checkRange(value, 30, 300);
        this.service.computeShellBound(res.size, res.scale);
    }

    public resize(size: ISize) {
        const res = this.service.shellSize$.value;
        if (!res) {
            return;
        }
        res.size.width = size.width;
        res.size.height = size.height;
        this.service.computeShellBound(res.size, res.scale);
    }

    public push(weight: Widget, location?: IPoint) {
        if (!location && !this.inBound(location)) {
            return false;
        }
        if (location) {
            weight.location = this.getPosition(location);
        }
        this.service.pushWidget(weight);
        return true;
    }

    public remove(weight: Widget) {
        this.service.removeWidget(weight);
        this.service.selectionChanged$.next([]);
    }

    private inBound(p: IPoint) {
        return isIntersect(this.wordShellBound, p);
    }

    public execute(action: IEditorAction|MENU_ACTION) {
        const act = typeof action === 'object' ? action.action : action;
        const data = typeof action === 'object' ?  action.data : undefined;
        switch (act) {
            case MENU_ACTION.DELETE:
                const items = data || this.service.selectionChanged$.value;
                if (!items || items.length < 0) {
                    return;
                }
                this.executeCommand(new BatchCommand(...(items as Widget[]).map(i => new RemoveWeightCommand(this, i))));
                return;
            case MENU_ACTION.BACK:
                this.undo();
                return;
            case MENU_ACTION.FORWARD:
                this.reverseUndo();
                return;
            case MENU_ACTION.VISIBLE_RULE:
                this.rulePanel.lineVisible = true;
                return;
            case MENU_ACTION.HIDE_RULE:
                this.rulePanel.lineVisible = false;
                return;
            case MENU_ACTION.SELECT_ALL:
                this.service.selectionChanged$.next(this.widgetItems$.value);
                return;
            case MENU_ACTION.SCALE_UP:
                this.scale(undefined, 10);
                return;
            case MENU_ACTION.SCALE_DOWN:
                this.scale(undefined, -10);
                return;
        }
    }
}
