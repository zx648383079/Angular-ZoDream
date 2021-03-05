import { Component, OnInit } from '@angular/core';
import { MicroService } from './micro.service';
import { IMicro } from '../theme/models/micro';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-micro',
    templateUrl: './micro.component.html',
    styleUrls: ['./micro.component.scss']
})
export class MicroComponent implements OnInit {

    public items: IMicro[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;

    constructor(
        private service: MicroService,
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapToggleComment(item: IMicro) {
        this.router.navigate(['detail', item.id], {relativeTo: this.route});
    }

    public tapCollect(item: IMicro) {
        this.service.collect(item.id).subscribe(res => {
            item.is_collected = res.is_collected;
            item.collect_count = res.collect_count;
        });
    }

    public tapRecommend(item: IMicro) {
        this.service.recommend(item.id).subscribe(res => {
            item.is_recommended = res.is_recommended;
            item.recommend_count = res.recommend_count;
        });
    }

    public onPublish(item: IMicro) {
        this.tapRefresh();
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
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
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
        this.service.getList({
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            res.data = res.data.map(i => {
                i.attachment_current = 0;
                return i;
            });
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}
