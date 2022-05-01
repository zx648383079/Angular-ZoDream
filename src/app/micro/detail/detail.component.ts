import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog';
import { AppState } from '../../theme/interfaces';
import { IComment, IMicro } from '../model';
import { IErrorResult } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { MicroService } from '../micro.service';
import { emptyValidate } from '../../theme/validators';
import { openLink } from '../../theme/deeplink';
import { DialogBoxComponent } from '../../dialog';
import { IBlockItem } from '../../link-rule';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IMicro;
    public authUser: IUser;
    public editData = {
        content: '',
        is_comment: false,
        id: 0,
    };

    constructor(
        private service: MicroService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: DialogService,
        private store: Store<AppState>,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.authUser = user;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                this.router.navigate(['../']);
                return;
            }
            this.loadDetail(param.id);
        });
    }

    loadDetail(id: number) {
        this.service.get(id).subscribe(res => {
            this.data = res;
        });
    }

    public tapBlock(item: IBlockItem) {
        if (item.user) {
            this.router.navigate(['../../'], {relativeTo: this.route, queryParams: {
                user: item.user
            }});
            return;
        }
        if (item.topic) {
            this.router.navigate(['../../'], {relativeTo: this.route, queryParams: {
                topic: item.topic
            }});
            return;
        }
        if (item.link) {
            openLink(this.router, item.link);
            return;
        }
    }
    public tapCollect() {
        if (!this.data) {
            return;
        }
        this.service.collect(this.data.id).subscribe(res => {
            this.data.is_collected = res.is_collected;
            this.data.collect_count = res.collect_count;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapRecommend() {
        if (!this.data) {
            return;
        }
        this.service.recommend(this.data.id).subscribe(res => {
            this.data.is_recommended = res.is_recommended;
            this.data.recommend_count = res.recommend_count;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapForward(modal: DialogBoxComponent) {
        if (!this.data) {
            return;
        }
        this.editData = {
            content: '',
            is_comment: false,
            id: this.data.id,
        };
        modal.open(() => {
            this.service.forward(this.editData).subscribe(res => {
                this.toastrService.success($localize `Forwarded`);
            });
        }, () => !emptyValidate(this.editData.content));
    }

    public tapRemove(item: IMicro) {
        this.toastrService.confirm($localize `Are you sure you want to delete this post? `, () => {
            this.service.remove(item.id).subscribe({
                next: res => {
                    if (!res.data) {
                        return;
                    }
                    this.toastrService.success($localize `successfully deleted! `);
                    this.router.navigate(['../']);
                }, 
                error: (err: IErrorResult) => {
                    this.toastrService.warning(err.error.message);
                }
            });
        });
    }

    
    
}
