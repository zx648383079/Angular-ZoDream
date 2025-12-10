import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { INavLink } from '../../theme/models/seo';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { AppStoreService } from './app-store.service';
import { ICategory } from './model';

@Component({
    standalone: false,
  selector: 'app-app-store',
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss']
})
export class AppStoreComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private store = inject<Store<AppState>>(Store);
    private service = inject(AppStoreService);


    public navItems: ICategory[] = [
        {name: '推荐'} as any,
    ];
    public navIndex = 0;
    public user: IUser;
    public searchVisible = false;
    public navOpen = false;

    public get subNavItems(): ICategory[] {
        return this.navItems[this.navIndex].children;
    }

    ngOnInit() {
        this.searchVisible = window.location.pathname.indexOf('category') > 0;
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.searchVisible = event.url.indexOf('category') > 0;
            }
        }); 
        this.service.batch({
            categories: {},
            recommend: {}
        }).subscribe(res => {
            this.navItems = [this.navItems[0]].concat(res.categories || []);
            this.navItems[0].children = res.recommend || [];
        });
    }


    public tapSearch(form: any) {
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: form});
    }

    public toggleNav() {
        this.navOpen = !this.navOpen;
    }

}
