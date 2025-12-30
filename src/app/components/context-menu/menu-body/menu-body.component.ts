import { Component, input, output } from '@angular/core';
import { IMenuButton, IMenuItem } from '../model';

@Component({
    standalone: false,
    selector: 'app-menu-body',
    templateUrl: './menu-body.component.html',
    styleUrls: ['./menu-body.component.scss'],
    host: {
        class: 'menu-flyout-body',
        '[class.menu-flow-left]': 'flowLeft()'
    }
})
export class MenuBodyComponent {

    public readonly items = input<IMenuItem[]>([]);

    public readonly flowLeft = input(false);

    public readonly tapped = output<IMenuButton>();

    public tapMenuItem(item: IMenuItem) {
        if (item.disabled) {
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
