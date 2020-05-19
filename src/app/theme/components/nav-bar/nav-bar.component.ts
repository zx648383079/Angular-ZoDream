import { Component, OnInit, Input } from '@angular/core';

export interface INav {
  name: string;
  icon?: string;
  label?: string;
  url?: string;
  children?: INav[];
  expand?: boolean;
  active?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public navToggle = false;

  @Input() public menu: INav[] = [];

  @Input() public bottomMenu: INav[] = [];

  constructor() { }

  ngOnInit() {
  }

  public tapItem(item: INav) {
    item.active = !item.active;
    if (item.children) {
      item.expand = !item.expand;
    }
    this.menu.forEach(i => {
      i.active = item === i;
      i.expand = item === i && i.children && i.children.length > 0;
      if (!i.children) {
        return;
      }
      i.children.forEach(j => {
        j.active = item === j;
      });
    });
    this.bottomMenu.forEach(i => {
      i.active = item === i;
      i.expand = item === i && i.children && i.children.length > 0;
    });
  }
}
