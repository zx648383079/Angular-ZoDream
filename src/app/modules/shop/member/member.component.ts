import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ISite } from '../../../theme/models/seo';
import { selectAuth } from '../../../theme/reducers/auth.selectors';
import { ShopAppState } from '../shop.reducer';
import { selectSite } from '../shop.selectors';
import { ShopService } from '../shop.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: false,
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnDestroy {
    private service = inject(ShopService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store = inject<Store<ShopAppState>>(Store);

    public site: ISite = {} as any;
    public title = '个人中心';
    private subItems = new Subscription();

    constructor() {
        this.subItems.add(this.store.select(selectAuth).subscribe(res => {
            if (!res.isLoading && res.guest) {
                this.router.navigate(['../market/auth'], {relativeTo: this.route});
                return;
            }
        }));
        this.subItems.add(this.store.select(selectSite).subscribe(site => {
            this.site = site;
        }));
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
    }

    public onRouterActivate(componentRef: any) {
        setTimeout(() => {
            this.title = componentRef.title || '个人中心';
        }, 100);
    }

}
