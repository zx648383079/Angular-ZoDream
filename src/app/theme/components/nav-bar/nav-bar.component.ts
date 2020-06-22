import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  @Input() public hasSuggest = false;

  @Input() public suggestItems: string[] = [];

  @Output() public suggestSubmited = new EventEmitter<string>();

  public suggestText = '';

  constructor() { }

  ngOnInit() {
  }

  public tapSuggest() {
    const isOpen = document.body.clientWidth <= 769;
    if (this.navToggle !== isOpen) {
      this.navToggle = isOpen;
      return;
    }
    this.suggestSubmited.emit(this.suggestText);
  }

  public suggestKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.suggestSubmited.emit(this.suggestText);
    }
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
