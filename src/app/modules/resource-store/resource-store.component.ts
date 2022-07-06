import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { INav } from '../../theme/components';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';

@Component({
  selector: 'app-resource-store',
  templateUrl: './resource-store.component.html',
  styleUrls: ['./resource-store.component.scss']
})
export class ResourceStoreComponent implements OnInit {

    public navItems: INav[] = [
        {name: '推荐'},
    ];
    public navIndex = 0;
    public user: IUser;
    public searchVisible = false;
    public navOpen = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
    ) { }

    public get subNavItems(): INav[] {
        return [
            {name: '推荐'}
        ];
    }

    ngOnInit() {
        this.searchVisible = window.location.pathname.indexOf('category') > 0;
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.searchVisible = event.url.indexOf('category') > 0;
            }
        });
    }


    public tapSearch(form: any) {
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: form});
    }

    public toggleNav() {
        this.navOpen = !this.navOpen;
    }

}
