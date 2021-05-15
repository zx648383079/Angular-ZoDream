import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog';
import { IPlatform } from '../../../theme/models/open';
import { IData, IDataOne } from '../../../theme/models/page';

@Component({
  selector: 'app-platform-option',
  templateUrl: './platform-option.component.html',
  styleUrls: ['./platform-option.component.scss']
})
export class PlatformOptionComponent implements OnInit {

  @Input() public url: string;

  public platformId = 0;
  public platformItems: IPlatform[] = [];
  public items: any[] = [];

  constructor(
    private http: HttpClient,
    private toastrService: DialogService,
  ) { }

  ngOnInit() {
    this.http.get<IData<IPlatform>>(this.url + '/platform').subscribe(res => {
      this.platformItems = res.data;
      if (res.data.length > 0) {
        this.platformId = res.data[0].id;
        this.tapPlatformChange();
      }
    });
  }

  public tapPlatformChange() {
    this.http.get<IData<any>>(this.url + '/option', {
      params: {
        platform_id: this.platformId.toString(),
      }
    }).subscribe(res => {
      this.items = [];
      this.each(res.data, (item, key) => {
        const group = {
          name: key,
          label: item._label,
          children: []
        };
        this.each(item, (val, i) => {
          if (i.indexOf('_label') >= 0 || i.indexOf('_tip') >= 0) {
            return;
          }
          group.children.push({
            name: i,
            label: Object.prototype.hasOwnProperty.call(item, i + '_label') ? item[i + '_label'] : this.studly(i),
            tip: Object.prototype.hasOwnProperty.call(item, i + '_tip') ? item[i + '_tip'] : undefined,
            value: val
          });
        });
        this.items.push(group);
      });
    });
  }

  public saveOption() {
    const option = {};
    for (const group of this.items) {
      const data = {};
      for (const item of group.children) {
        data[item.name] = item.value;
      }
      option[group.name] = data;
    }
    this.http.post<IDataOne<boolean>>(this.url + '/save_option', {
      platform_id: this.platformId,
      option,
    }).subscribe(res => {
      if (res.data) {
        this.toastrService.success('配置保存成功');
      }
    });
  }

  private studly(key: string): string {
    const re = /[-_](\w)/g;
    return key.replace(re, ($0, $1) => {
      return $1.toUpperCase();
    });
  }

  private each(obj, cb: (val: any, key: string) => void) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cb(obj[key], key);
      }
    }
  }

}
