import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ISite } from '../../theme/models/seo';
import { IArticle } from '../../theme/models/shop';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { AuthService } from '../../theme/services';
import { setSite } from '../shop.actions';
import { ShopAppState } from '../shop.reducer';
import { selectSite } from '../shop.selectors';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

    public noticeItems: IArticle[] = [];

    public user: IUser;

    public site: ISite = {} as any;

    constructor(
        private service: ShopService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private store: Store<ShopAppState>,
        private authService: AuthService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            if (!user || !user.id) {
                this.router.navigate(['../market/auth'], {relativeTo: this.route});
                return;
            }
            this.user = user;
        });
        this.store.select(selectSite).subscribe(site => {
            this.site = site;
        });
    }

    ngOnInit(): void {
        this.service.notice().subscribe(res => {
            this.noticeItems = res.data;
        });
    }

    public tapLogout() {
        this.authService.logout().subscribe(() => {
        });
    }

}
