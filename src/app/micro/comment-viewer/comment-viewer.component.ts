import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IErrorResponse } from '../../theme/models/page';
import { IEmoji } from '../../theme/models/seo';
import { IUser } from '../../theme/models/user';
import { MicroService } from '../micro.service';
import { IComment } from '../model';

@Component({
  selector: 'app-comment-viewer',
  templateUrl: './comment-viewer.component.html',
  styleUrls: ['./comment-viewer.component.scss']
})
export class CommentViewerComponent implements OnChanges {

    @Input() public open = false;
    @Input() public user: IUser;
    @Input() public micro = 0;
    @Input() public auto = false;
    @Output() public loadMore = new EventEmitter<void>();
    public items: IComment[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 10;
    private booted = false;

    public editData = {
        content: '',
        parent_id: 0,
        is_forward: false,
    };

    constructor(
        private toastrService: ToastrService,
        private service: MicroService,
    ) { }

    @HostListener('scroll', [
        '$event.target.scrollTop',
        '$event.target.scrollHeight',
        '$event.target.offsetHeight',
    ])
    public onDivScroll(
        scrollY: number,
        scrollheight: number,
        offsetHeight: number,
    ): void {
        if (!this.auto) {
            return;
        }
        const height = scrollheight;
        const y = scrollY + offsetHeight;
        if (this.hasMore && y + 50 > height) {
            this.tapMore();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.open || changes.micro) {
            this.init();
        }
    }

    private init() {
        if (this.booted) {
            return;
        }
        if (this.micro < 1 || !this.open) {
            return;
        }
        this.booted = true;
        this.tapRefresh();
    }

    public tapEmoji(item: IEmoji) {
        this.editData.content += item.type > 0 ? item.content : '[' + item.name + ']';
    }

    public tapComment() {
        if (this.editData.content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        if (this.micro < 1) {
            this.toastrService.warning('操作失败');
            return;
        }
        const data = Object.assign({micro_id: this.micro}, this.editData);
        this.service.commentSave(data).subscribe(_ => {
            this.toastrService.success('评论成功！');
            this.editData.content = '';
            this.editData.parent_id = 0;
        }, err => {
            const res = err.error as IErrorResponse;
            this.toastrService.warning(res.message);
        });
    }

    public tapCommenting(item?: IComment) {
        this.editData.parent_id = item?.id || 0;
        this.editData.content = '回复 @' + item.user.name;
    }

    public onCommentChange() {
        if (this.editData.parent_id < 1) {
            return;
        }
        if (this.editData.content.indexOf('回复 @') !== 0) {
            this.editData.parent_id = 0;
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
        if (!this.auto) {
            this.loadMore.emit();
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
            id: this.micro,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
            this.total = res.paging.total;
            this.perPage = res.paging.limit;
        }, () => {
            this.isLoading = false;
        });
    }
}
