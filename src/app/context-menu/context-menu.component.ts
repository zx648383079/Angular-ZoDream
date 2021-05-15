import { Component, HostListener, Input } from '@angular/core';
import { hasElementByClass } from '../theme/utils';
import { IMenuButton, IMenuItem, MenuEvent } from './model';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

    @Input() public items: IMenuItem[] = [];

    public fixedLeft = false;
    public isOpen = false;

    private x: number;
    private y: number;
    private finished: MenuEvent;

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.dialog-menu') && !hasElementByClass(event.path, 'dialog-menu')) {
            this.isOpen = false;
        }
    }

    constructor() { }

    get boxStyle() {
        return {
            left: this.x + 'px',
            top: this.y + 'px',
            display: this.isOpen ? 'block' : 'none',
        };
    }

    public show(x: number, y: number): void;
    public show(event: MouseEvent): void;
    public show(event: MouseEvent, nav: IMenuItem[]): void;
    public show(x: number, y: number, nav: IMenuItem[]): void;

    public show(event: MouseEvent, nav: IMenuItem[], cb: MenuEvent): void;
    public show(x: number, y: number, nav: IMenuItem[], cb: MenuEvent): void;

    public show(x: number|MouseEvent, y?: number | IMenuItem[], nav?: IMenuItem[] | MenuEvent, cb?: MenuEvent) {
        if (typeof x === 'object') {
            [y, nav, cb] = [x.clientY, y as IMenuItem[], nav as MenuEvent];
            x = x.clientX;
        }
        this.x = x;
        this.y = y as number;
        if (nav) {
            this.items = nav as IMenuItem[];
        }
        if (cb) {
            this.finished = cb;
        }
        this.isOpen = true;
    }

    public tapMenuItem(item: IMenuButton) {
        if (item.disable) {
            return;
        }
        if (item.children && item.children.length > 0) {
            return;
        }
        if (item.onTapped) {
            item.onTapped();
        }
        if (this.finished) {
            this.finished(item);
        }
        this.isOpen = false;
    }

}
