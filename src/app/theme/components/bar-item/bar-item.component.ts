import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { INav } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-bar-item',
  templateUrl: './bar-item.component.html',
  styleUrls: ['./bar-item.component.scss']
})
export class BarItemComponent {

  @Input() item: INav;

  @Output() selectItem = new EventEmitter<INav>();

  constructor() { }

  tapItem() {
    this.item.active = !this.item.active;
    if (this.item.children) {
      this.item.expand = !this.item.expand;
    }
    this.selectItem.emit(this.item);
  }

  public tapChild(item: INav) {
    this.item.children.forEach(i => {
      i.active = item === i;
      i.expand = item === i && i.children && i.children.length > 0;
    });
  }

}
