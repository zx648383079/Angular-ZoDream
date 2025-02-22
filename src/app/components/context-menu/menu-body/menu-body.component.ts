import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMenuButton, IMenuItem } from '../model';

@Component({
    standalone: false,
    selector: 'app-menu-body',
    templateUrl: './menu-body.component.html',
    styleUrls: ['./menu-body.component.scss']
})
export class MenuBodyComponent {

    @Input() public items: IMenuItem[] = [];
    @Input() public flowLeft = false;

    @Output() public tapped = new EventEmitter<IMenuButton>();

    constructor() { }

    public tapMenuItem(item: IMenuItem) {
        if (item.disable) {
            return;
        }
        if (item.children && item.children.length > 0) {
            return;
        }
        if (item.onTapped) {
            item.onTapped();
        }
        this.tapped.emit(item as IMenuButton);
    }

}
