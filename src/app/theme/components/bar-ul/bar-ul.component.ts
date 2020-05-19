import { Component, OnInit, Input } from '@angular/core';
import { INav } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-bar-ul',
  templateUrl: './bar-ul.component.html',
  styleUrls: ['./bar-ul.component.scss']
})
export class BarUlComponent {

  @Input() public items: INav[] = [];

  constructor() { }


  tapItem(item: INav) {
    this.items.forEach(i => {
      i.active = item === i;
      i.expand = item === i && i.children && i.children.length > 0;
    });
  }
}
