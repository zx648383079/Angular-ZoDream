import { Component, OnInit, inject, signal } from '@angular/core';
import { IUser, IUserStatus } from '../../../theme/models/user';
import { MemberSpaceService } from './member-space.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, ManageDialogEvent } from '../../../components/dialog';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';

@Component({
    standalone: false,
    selector: 'app-member-space',
    templateUrl: './member-space.component.html',
    styleUrls: ['./member-space.component.scss']
})
export class MemberSpaceComponent implements OnInit {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(MemberSpaceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly isLoading = signal(false);
    public readonly data = signal<IUserStatus>(null);
    public readonly authUser = signal<IUser>(null);

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.authUser.set(user);
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data.set({id: params.user} as any);
            this.tapRefresh();
        });
    }

    public tapRefresh() {
        this.isLoading.set(true);
        this.service.user({
            user: this.data().id
        }).subscribe({
            next: res => {
                this.data.set(res);
                this.isLoading.set(false);
            },
            error: err => {
                this.isLoading.set(false);
                this.toastrService.error(err);
                history.back();
            }
        })
    }

    public tapFollow() {
        this.service.toggleFollow(this.data().id).subscribe({
            next: res => {
                this.data.update(v => {
                    v.follow_status = res.data;
                    if (res.data > 0) {
                        v.mark_status = 0;
                    }
                    return {...v}
                });
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
                user: this.data().id,
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
        this.service.toggleMark(this.data().id).subscribe({
            next: res => {
                this.data.update(v => {
                    v.mark_status = res.data;
                    if (res.data > 0) {
                        v.follow_status = 0;
                    }
                    return {...v}
                });
            },
            error: err => {
                this.toastrService.error(err.error);
            }
        });
    }
}
