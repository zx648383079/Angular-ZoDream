import { Component, Input, OnInit } from '@angular/core';
import { ITabBarItem } from '../../model';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {

    @Input() public color = '#000';
    @Input() public background = '#ff';
    @Input() public selectedColor = '#f00';
    @Input() public items: ITabBarItem[] = [];
    @Input() public selected = 0;

    public get barStyle() {
        return {
            background: this.background,
            color: this.color,
        };
    }

    constructor() { }

    public itemStyle(i: number) {
        const item = this.items[i];
        if (i === this.selected) {
            return {
                color: item.selectedColor || this.selectedColor,
            };
        }
        return {
            color: item.color || this.color,
        };
    }

    public tapToggle(i: number) {
        this.selected = i;
    }
}
