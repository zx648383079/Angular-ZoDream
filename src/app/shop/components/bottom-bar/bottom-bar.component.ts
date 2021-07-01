import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ISite } from '../../../theme/models/seo';
import { ShopAppState } from '../../shop.reducer';
import { selectSite } from '../../shop.selectors';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent implements OnInit {

    public site: ISite = {} as any;

    constructor(
        private store: Store<ShopAppState>,
    ) {
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
