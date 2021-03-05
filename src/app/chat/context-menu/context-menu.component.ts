import { Component, Input } from '@angular/core';
import { INav } from '../../theme/components';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {

    @Input() public items: INav[] = [];

    public fixedLeft = false;
    public isOpen = false;

    private x: number;
    private y: number;
    private finished: (item: INav) => void;

    constructor() { }

    get boxStyle() {
        return {
            left: this.x + 'px',
            top: this.y + 'px',
            display: this.isOpen ? 'block' : 'none',
        };
    }
    public show(x: number, y: number, nav?: INav[], cb?: (item: INav) => void) {
        if (nav) {
            this.items = nav;
        }
        if (cb) {
            this.finished = cb;
        }
        this.x = x;
        this.y = y;
        this.isOpen = true;
    }

    public tapMenuItem(item: INav) {
        if (item.children && item.children.length > 0) {
            return;
        }
        if (this.finished) {
            this.finished(item);
        }
        this.isOpen = false;
    }
}
