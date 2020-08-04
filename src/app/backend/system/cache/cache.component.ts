import { Component, OnInit } from '@angular/core';
import { IItem } from '../../../theme/models/seo';
import { SystemService } from '../system.service';

@Component({
  selector: 'app-cache',
  templateUrl: './cache.component.html',
  styleUrls: ['./cache.component.scss']
})
export class CacheComponent implements OnInit {

  public items: IItem[] = [];

  constructor(
    private service: SystemService
  ) {
    this.service.cacheStore().subscribe(res => {
      this.items = res;
    });
  }

  ngOnInit() {
  }

}
