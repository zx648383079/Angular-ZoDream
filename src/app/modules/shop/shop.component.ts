import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { setSite } from './shop.actions';
import { ShopAppState } from './shop.reducer';
import { ShopService } from './shop.service';

@Component({
    standalone: false,
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
    private readonly store = inject<Store<ShopAppState>>(Store);
    private readonly service = inject(ShopService);


    ngOnInit(): void {
        this.service.site().subscribe(site => {
            this.store.dispatch(setSite({site}));
        });
    }

}
