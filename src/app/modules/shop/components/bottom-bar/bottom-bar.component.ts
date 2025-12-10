import { Component, OnInit, inject } from '@angular/core';
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
export class BottomBarComponent implements OnInit {
    private store = inject<Store<ShopAppState>>(Store);


    public site: ISite = {} as any;

    constructor() {
        this.store.select(selectSite).subscribe(site => {
            this.site = site || {} as any;
        });
    }

    ngOnInit() {
    }

    public tapToTop() {
        document.documentElement.scrollTop = 0;
    }
}
