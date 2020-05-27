import { Component, OnInit, ViewChild } from '@angular/core';
import { DiskService } from '../disk.service';
import { IDisk } from 'src/app/theme/models/disk';
import { MediaPlayerComponent } from 'src/app/theme/components';


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

  @ViewChild(MediaPlayerComponent)
  private player: MediaPlayerComponent;

  public playerVisiable = false;

  public viewMode = false;

  public editMode = false;

  public checkedAll = false;

  public items: IDisk[] = [];

  public crumbs: ICrumb[] = [
    {
      name: '全部文件',
      icon: 'icon-desktop',
      disable: true
    },
  ];

  constructor(
    private service: DiskService
  ) {}

  ngOnInit() {
    this.service.getCatalog(0).subscribe(res => {
      this.items = res.map(i => {
        i.icon = this.service.getIconByExt(i.file_id < 1 ? undefined : i.file?.extension);
        return i;
      });
    });
  }

  public tapFile(item: IDisk) {
    this.playerVisiable = false;
    if (this.editMode) {
      item.checked = !item.checked;
      if (!item.checked) {
        this.checkedAll = false;
      } else {
        this.checkedIfAll();
      }
      return;
    }
    if (item.file_id < 1 || !item.file) {
      return;
    }
    this.playerVisiable = true;
    this.player.play({
      name: item.name,
      type: this.service.getTypeByExt(item.file.extension),
      size: item.file.size,
      thumb: item.file.thumb,
      url: item.file.url
    });
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
