import { Component, OnInit } from '@angular/core';
import { ISubtotal, ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  public items: ISubtotal[];

  constructor(
    private service: ShopService
  ) {
    this.service.statistics().subscribe(res => {
      this.items = res;
    });
  }

  ngOnInit(): void {
  }

}
