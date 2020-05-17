import { Component, OnInit } from '@angular/core';


interface ICrumb {
  name: string;
  icon?: string;
  disable?: boolean;
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  public viewMode = false;

  public editMode = true;

  public checkedAll = false;

  public items = [
    {
      type: 'group',
      name: '文件夹'
    },
    {
      name: '文件',
      icon: 'icon-folder-o',
      size: '1M',
      time: '2018-1-1 00:00:00'
    },
    {
      name: '文件2',
      icon: 'icon-file-o',
      size: '1M',
      time: '2018-1-4 00:00:00',
      checked: true
    }
  ];

  public crumbs: ICrumb[] = [
    {
      name: '全部文件',
      icon: 'icon-desktop',
      disable: true
    },
    {
      name: '音乐'
    }
  ];

  constructor() {}

  ngOnInit() {
  }

  public tapFile(item: any) {
    if (this.editMode) {
      item.checked = !item.checked;
      if (!item.checked) {
        this.checkedAll = false;
      } else {
        this.checkedIfAll();
      }
    }
  }

  public checkedIfAll() {
    for (const item of this.items) {
      if (item.type === 'group') {
        continue;
      }
      if (!item.checked) {
        return;
      }
    }
    this.checkedAll = true;
  }

  public tapCheckAll() {
    this.checkedAll = !this.checkedAll;
    for (const item of this.items) {
      if (item.type === 'group') {
        continue;
      }
      item.checked = this.checkedAll;
    }
  }
}
