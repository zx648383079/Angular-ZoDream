import { Pipe, PipeTransform, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ShopAppState } from '../shop.reducer';
import { selectSite } from '../shop.selectors';

@Pipe({
    standalone: false,
    name: 'price',
    pure: false,
})
export class PricePipe implements PipeTransform {
    private readonly store = inject<Store<ShopAppState>>(Store);


    private currency = '￥';

    constructor() {
        this.store.select(selectSite).subscribe(site => {
            if (site && site.currency) {
                this.currency = site.currency;
            }
        });
    }

    transform(value?: number, args?: any): any {
        if (!value || isNaN(value)) {
            value = 0;
        }
        if (typeof value !== 'number') {
            value = parseFloat(value);
        }
        return this.currency + value.toLocaleString();
    }

}
