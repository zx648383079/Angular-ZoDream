import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { INav } from '../../theme/components';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ICategory } from './model';
import { ResourceService } from './resource.service';

@Component({
  selector: 'app-resource-store',
  templateUrl: './resource-store.component.html',
  styleUrls: ['./resource-store.component.scss']
})
export class ResourceStoreComponent implements OnInit {

    public navItems: ICategory[] = [
        {name: '推荐'} as any,
    ];
    public navIndex = 0;
    public user: IUser;
    public searchVisible = false;
    public navOpen = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private service: ResourceService,
    ) { }

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
            this.navItems = [this.navItems[0]].concat(res.categories);
            this.navItems[0].children = res.recommend;
        });
    }


    public tapSearch(form: any) {
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: form});
    }

    public toggleNav() {
        this.navOpen = !this.navOpen;
    }

}
