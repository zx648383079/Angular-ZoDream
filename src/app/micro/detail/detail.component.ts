import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppState } from '../../theme/interfaces';
import { IComment, IMicro } from '../model';
import { IErrorResponse } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { MicroService } from '../micro.service';
import { DialogBoxComponent } from '../../theme/components';
import { emptyValidate } from '../../theme/validators';
import { IEmoji } from '../../theme/models/seo';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IMicro;

    public commentItems: IComment[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

    public user: IUser;

    public commentData = {
        content: '',
        parent_id: 0,
        is_forward: false,
    };
    public editData = {
        content: '',
        is_comment: false,
        id: 0,
    };

    constructor(
        private service: MicroService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private store: Store<AppState>,
        private sanitizer: DomSanitizer,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
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
            res.attachment_current = 0;
            res.html = this.sanitizer.bypassSecurityTrustHtml(res.content);
            this.data = res;
            this.tapRefresh();
        });
    }

    public tapEmoji(item: IEmoji) {
        this.commentData.content += item.type > 0 ? item.content : '[' + item.name + ']';
    }

    public tapCollect() {
        if (!this.data) {
            return;
        }
        this.service.collect(this.data.id).subscribe(res => {
            this.data.is_collected = res.is_collected;
            this.data.collect_count = res.collect_count;
        });
    }

    public tapRecommend() {
        if (!this.data) {
            return;
        }
        this.service.recommend(this.data.id).subscribe(res => {
            this.data.is_recommended = res.is_recommended;
            this.data.recommend_count = res.recommend_count;
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
                this.toastrService.success('已转发');
            });
        }, () => !emptyValidate(this.editData.content));
    }

    public tapRemove(item: IMicro) {
        if (!confirm('确定要删除这条微博?')) {
            return;
        }
        this.service.remove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.router.navigate(['../']);
        });
    }

    public tapComment() {
        if (this.commentData.content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        const data = Object.assign({micro_id: this.data.id}, this.commentData);
        this.service.commentSave(data).subscribe(_ => {
            this.toastrService.success('评论成功！');
            this.commentData.content = '';
            this.commentData.parent_id = 0;
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message);
        });
    }

    public tapPrevious(item: IMicro) {
        if (item.attachment_current === 0) {
            item.attachment_current = item.attachment.length - 1;
            return;
        }
        item.attachment_current --;
    }

    public tapNext(item: IMicro) {
        if (item.attachment_current === item.attachment.length - 1) {
            item.attachment_current = 0;
            return;
        }
        item.attachment_current ++;
    }

    public tapAttachment(i: number, item: IMicro) {
        item.attachment_open = true;
        item.attachment_current = i;
    }

    public tapCommenting(item?: IComment) {
        this.commentData.parent_id = item?.id || 0;
        this.commentData.content = '回复 @' + item.user.name;
    }

    public onCommentChange() {
        if (this.commentData.parent_id < 1) {
            return;
        }
        if (this.commentData.content.indexOf('回复 @') !== 0) {
            this.commentData.parent_id = 0;
        }
    }

    public tapAgreeComment(item: IComment) {
        this.service.commentAgree(item.id).subscribe(res => {
            item.agree = res.agree;
            item.agree_type = res.agree_type;
            item.disagree = res.disagree;
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.commentList({
            id: this.data.id,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.commentItems = res.data;
            this.total = res.paging.total;
            this.perPage = res.paging.limit;
        }, () => {
            this.isLoading = false;
        });
    }
}
