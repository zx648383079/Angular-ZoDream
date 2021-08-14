import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog';
import { ISite } from '../../theme/models/seo';
import { IArticle } from '../../theme/models/shop';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { AuthService } from '../../theme/services';
import { ShopAppState } from '../shop.reducer';
import { selectSite } from '../shop.selectors';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent {
    public site: ISite = {} as any;
    public title = '个人中心';

    constructor(
        private service: ShopService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<ShopAppState>,
        private authService: AuthService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            if (!user || !user.id) {
                this.router.navigate(['../market/auth'], {relativeTo: this.route});
                return;
            }
        });
        this.store.select(selectSite).subscribe(site => {
            this.site = site;
        });
    }

    public onRouterActivate(componentRef: any) {
        this.title = componentRef.title || '个人中心';
    }

}
