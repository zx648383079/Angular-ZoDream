import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { IItem } from '../../../theme/models/seo';
import { SystemService } from '../system.service';

@Component({
    standalone: false,
  selector: 'app-cache',
  templateUrl: './cache.component.html',
  styleUrls: ['./cache.component.scss']
})
export class CacheComponent implements OnInit {

  public items: IItem[] = [];

  constructor(
    private service: SystemService,
    private toastrService: DialogService,
  ) {
    this.service.cacheStore().subscribe(res => {
      this.items = res;
    });
  }

  ngOnInit() {
  }


  public tapSubmit() {
    const store: string[] = [];
    for (const item of this.items) {
        if (item.checked) {
          store.push(item.value as string);
        }
    }
    if (store.length < 1) {
      this.toastrService.warning('未选中任何内容');
      return;
    }
    this.service.cacheClear({store}).subscribe(res => {
      this.toastrService.success('成功清除缓存');
    });
  }


  public tapClear() {
    if (!confirm('确认清除全部缓存?')) {
      return;
    }
    this.service.cacheClear({}).subscribe(res => {
      this.toastrService.success('成功清除全部缓存');
    });
  }
}
