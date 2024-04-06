import { Component, OnInit } from '@angular/core';
import { IUser, IUserStatus } from '../../../theme/models/user';
import { MemberSpaceService } from './member-space.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, ManageDialogEvent } from '../../../components/dialog';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';

@Component({
    selector: 'app-member-space',
    templateUrl: './member-space.component.html',
    styleUrls: ['./member-space.component.scss']
})
export class MemberSpaceComponent implements OnInit {

    public isLoading = false;
    public data: IUserStatus;
    public authUser: IUser;

    constructor(
        private store: Store<AppState>,
        private service: MemberSpaceService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        this.store.select(selectAuthUser).subscribe(user => {
            this.authUser = user;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data = {id: params.user} as any;
            this.tapRefresh();
        });
    }

    public tapRefresh() {
        this.isLoading = true;
        this.service.user({
            user: this.data.id
        }).subscribe({
            next: res => {
                this.data = res;
                this.isLoading = false;
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
                history.back();
            }
        })
    }

    public tapFollow() {
        this.service.toggleFollow(this.data.id).subscribe({
            next: res => {
                this.data.follow_status = res.data;
                if (res.data > 0) {
                    this.data.mark_status = 0;
                }
            },
            error: err => {
                this.toastrService.error(err.error);
            }
        });
    }

    public tapReport(modal: ManageDialogEvent) {
        modal.open(data => {
            if (!data.remark) {
                return false;
            }
            this.service.report({
                user: this.data.id,
                reason: data.remark
            }).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Report successful, waiting for manual review`);
                },
                error: err => {
                    this.toastrService.error(err.error);
                }
            });
        });
    }

    public tapMark() {
        this.service.toggleMark(this.data.id).subscribe({
            next: res => {
                this.data.mark_status = res.data;
                if (res.data > 0) {
                    this.data.follow_status = 0;
                }
            },
            error: err => {
                this.toastrService.error(err.error);
            }
        });
    }
}
