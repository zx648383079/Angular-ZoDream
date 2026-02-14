import { Component, inject, signal } from '@angular/core';
import { IUserStatus } from '../../../../../theme/models/user';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { mapFormat } from '../../../../../theme/utils';
import { AccountStatusItems } from '../../../../../theme/models/auth';

@Component({
    standalone: false,
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(AuthService);


    public user: IUserStatus;
    public readonly tabIndex = signal(0);
    public tabItems = ['账户信息', '账户变动记录', '账号操作记录', '账号登录记录', '数据中心'];

    constructor() {
        this.route.params.subscribe(params => {
            this.service.userAccount({id: params.id}).subscribe(user => {
                this.user = user;
            });
        });
    }

    public formatStatus(v: number) {
        return mapFormat(v, AccountStatusItems);
    }

    public tapTab(i: number) {
        this.tabIndex.set(i);
    }

}
