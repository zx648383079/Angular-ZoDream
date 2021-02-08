import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setSite } from './shop.actions';
import { ShopAppState } from './shop.reducer';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

    constructor(
        private store: Store<ShopAppState>,
        private service: ShopService,
    ) { }

    ngOnInit(): void {
        this.service.site().subscribe(site => {
            this.store.dispatch(setSite({site}));
        });
    }

}
