import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ISite } from '../../../../theme/models/seo';
import { ShopAppState } from '../../shop.reducer';
import { selectSite } from '../../shop.selectors';

@Component({
    standalone: false,
    selector: 'app-bottom-bar',
    templateUrl: './bottom-bar.component.html',
    styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent {
    private readonly store = inject<Store<ShopAppState>>(Store);


    public readonly site = signal<ISite>({} as any);

    constructor() {
        this.store.select(selectSite).subscribe(site => {
            this.site.set(site || {} as any);
        });
    }

    public tapToTop() {
        document.documentElement.scrollTop = 0;
    }
}
