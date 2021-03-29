import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ITopic } from '../../model';
import { MicroService } from '../micro.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
    public items: ITopic[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;
    public keywords = '';

    constructor(
        private service: MicroService,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {
        this.tapRefresh();
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
        this.service.topicList({
            keywords: this.keywords,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = res.data;
            this.total = res.paging.total;
            this.perPage = res.paging.limit;
        }, () => {
            this.isLoading = false;
        });
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords;
        this.tapRefresh();
    }


    public tapRemove(item: ITopic) {
        if (!confirm('确定删除“' + item.name + '”话题？')) {
            return;
        }
        this.service.topicRemove(item.id).subscribe(res => {
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
