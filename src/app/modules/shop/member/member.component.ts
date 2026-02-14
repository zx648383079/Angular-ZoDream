import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ISite } from '../../../theme/models/seo';
import { selectAuth } from '../../../theme/reducers/auth.selectors';
import { ShopAppState } from '../shop.reducer';
import { selectSite } from '../shop.selectors';
import { ShopService } from '../shop.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.scss']
})
export class MemberComponent {
    private readonly service = inject(ShopService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly store = inject<Store<ShopAppState>>(Store);
    private readonly destroyRef = inject(DestroyRef);

    public site: ISite = {} as any;
    public title = '个人中心';

    constructor() {
        this.store.select(selectAuth).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            if (!res.isLoading && res.guest) {
                this.router.navigate(['../market/auth'], {relativeTo: this.route});
                return;
            }
        });
        this.store.select(selectSite).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(site => {
            this.site = site;
        });
    }

    public onRouterActivate(componentRef: any) {
        setTimeout(() => {
            this.title = componentRef.title || '个人中心';
        }, 100);
    }

}
