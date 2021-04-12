import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IForum, IThread } from '../../model';
import { ForumService } from '../forum.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
    public items: IThread[] = [];

    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public forum: IForum;

    constructor(
        private service: ForumService,
        private toastrService: ToastrService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (!params.forum) {
                this.tapRefresh();
                return;
            }
            this.service.forum(params.forum).subscribe(res => {
                this.forum = res;
                this.tapRefresh();
            });
        });
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
        this.service.threadList({
            keywords: this.keywords,
            forum_id: this.forum?.id,
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

    public tapRemove(item: IThread) {
        if (!confirm('确定删除“' + item.title + '”帖子？')) {
            return;
        }
        this.service.threadRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }
}
