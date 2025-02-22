import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IArticle } from '../../model';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { AuthService } from '../../../../theme/services';
import { ShopAppState } from '../../shop.reducer';
import { ShopService } from '../../shop.service';

@Component({
    standalone: false,
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

    public noticeItems: IArticle[] = [];
    public user: IUser;

    constructor(
        private service: ShopService,
        private store: Store<ShopAppState>,
        private authService: AuthService,
    ) {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.service.notice().subscribe(res => {
            this.noticeItems = res.data;
        });
    }

    public tapLogout() {
        this.authService.logout().subscribe(() => {});
    }
}
