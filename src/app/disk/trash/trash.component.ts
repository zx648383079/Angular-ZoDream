import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  public checkedAll = false;

  public items = [
    {
      name: '文件',
      icon: 'icon-folder-o',
      size: '1M',
      time: '2018-1-1 00:00:00',
      checked: false
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  public tapFile(item: any) {
    item.checked = !item.checked;
    if (!item.checked) {
      this.checkedAll = false;
    } else {
      this.checkedIfAll();
    }
  }

  public checkedIfAll() {
    for (const item of this.items) {
      if (!item.checked) {
        return;
      }
    }
    this.checkedAll = true;
  }

  public tapCheckAll() {
    this.checkedAll = !this.checkedAll;
    for (const item of this.items) {
      item.checked = this.checkedAll;
    }
  }

}
