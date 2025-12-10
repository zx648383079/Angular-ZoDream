import { Component, input, model } from '@angular/core';
import { ITabBarItem } from '../../model';

@Component({
    standalone: false,
    selector: 'app-tab-bar',
    templateUrl: './tab-bar.component.html',
    styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {

    public readonly color = input('#000');
    public readonly background = input('#ff');
    public readonly selectedColor = input('#f00');
    public readonly items = input<ITabBarItem[]>([]);
    public readonly selected = model(0);

    public get barStyle() {
        return {
            background: this.background(),
            color: this.color(),
        };
    }

    constructor() { }

    public itemStyle(i: number) {
        const item = this.items()[i];
        if (i === this.selected()) {
            return {
                color: item.selectedColor || this.selectedColor(),
            };
        }
        return {
            color: item.color || this.color(),
        };
    }

    public tapToggle(i: number) {
        this.selected.set(i);
    }
}
