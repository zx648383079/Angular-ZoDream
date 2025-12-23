import { Component, computed, HostListener, model, signal } from '@angular/core';
import { hasElementByClass } from '../../theme/utils/doc';
import { IMenuButton, IMenuItem, MenuEvent } from './model';

@Component({
    standalone: false,
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

    public readonly items = model<IMenuItem[]>([]);

    public readonly flowLeft = signal(false);
    public readonly visible = signal(false);

    private x: number;
    private y: number;
    private finished: MenuEvent;

    @HostListener('document:click', ['$event']) 
    public hideCalendar(event: any) {
        if (!event.target.closest('.dialog-menu') && !hasElementByClass(event.path, 'dialog-menu')) {
            this.visible.set(false);
        }
    }
    
    public readonly boxStyle = computed(() => {
        return {
            left: this.x + 'px',
            top: this.y + 'px',
            display: this.visible() ? 'block' : 'none',
        };
    });

    public open(x: number, y: number): false;
    public open(event: MouseEvent): false;
    public open(event: MouseEvent, nav: IMenuItem[]): false;
    public open(x: number, y: number, nav: IMenuItem[]): false;

    public open(event: MouseEvent, nav: IMenuItem[], cb: MenuEvent): false;
    public open(x: number, y: number, nav: IMenuItem[], cb: MenuEvent): false;

    public open(x: number|MouseEvent, y?: number | IMenuItem[], nav?: IMenuItem[] | MenuEvent, cb?: MenuEvent) {
        if (typeof x === 'object') {
            x.stopPropagation();
            [y, nav, cb] = [x.clientY, y as IMenuItem[], nav as MenuEvent];
            x = x.clientX;
        }
        this.x = x;
        this.y = y as number;
        if (nav) {
            this.items.set(nav as IMenuItem[]);
        }
        if (cb) {
            this.finished = cb;
        }
        this.visible.set(true);
        return false;
    }

    public tapMenuItem(item: IMenuButton) {
        if (this.finished) {
            this.finished(item);
        }
        this.visible.set(false);
    }

}
