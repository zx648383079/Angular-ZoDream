import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IForum } from '../../theme/models/forum';
import { ForumService } from './forum.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

    public items: IForum[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public parent: IForum;

    constructor(
        private service: ForumService,
        private toastrService: ToastrService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            if (!res.parent_id || res.parent_id <= 0) {
                this.tapRefresh();
                return;
            }
            this.service.forum(res.parent_id).subscribe(data => {
                this.parent = data;
                this.tapRefresh();
            });
        });
    }

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.forumList({
            keywords: this.keywords,
            parent: this.parent?.id,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }

    public tapRemove(item: IForum) {
        if (!confirm('确定删除“' + item.name + '”板块？')) {
            return;
        }
        this.service.forumRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

    public tapViewChild(item?: IForum) {
        this.parent = item;
        this.keywords = '';
        this.tapRefresh();
    }

    public tapParent() {
        const parentId = this.parent ? this.parent.parent_id : 0;
        if (parentId < 1) {
            this.tapViewChild();
            return;
        }
        this.service.forum(parentId).subscribe(res => {
            this.tapViewChild(res);
        });
    }

}
