import { Component, OnInit } from '@angular/core';
import { MicroService } from './micro.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlockItem, IMicro, ITopic } from './model';
import { DialogBoxComponent } from '../theme/components';
import { emptyValidate } from '../theme/validators';
import { IUser } from '../theme/models/user';
import { IErrorResult } from '../theme/models/page';

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
    public keywords = '';
    public forwardItem: IMicro;
    public editData = {
        content: '',
        is_comment: false,
        id: 0,
    };

    public user: any;
    public topic: ITopic;

    constructor(
        private service: MicroService,
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.user && params.user > 0) {
                this.user = {id: params.user} as any;
                this.loadUser(params.user);
            }
            if (params.topic && params.topic > 0) {
                this.topic = {id: params.topic} as any;
                this.loadTopic(params.topic);
            }
            this.tapRefresh();
        });
    }

    private loadUser(user: number) {
        this.service.user(user).subscribe(res => {
            this.user = res;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    private loadTopic(topic: number) {
        this.service.topic(topic).subscribe(res => {
            this.topic = res;
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapUserBlcok(item: IBlockItem) {
        this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
            user: item.user
        }});
    }

    public tapTopicBlcok(item: IBlockItem) {
        this.router.navigate(['./'], {relativeTo: this.route, queryParams: {
            topic: item.topic
        }});
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

    public tapForward(modal: DialogBoxComponent, item: IMicro) {
        this.forwardItem = item;
        this.editData = {
            content: '',
            is_comment: false,
            id: item.id,
        };
        modal.open(() => {
            this.service.forward(this.editData).subscribe(res => {
                this.toastrService.success('已转发');
            });
        }, () => !emptyValidate(this.editData.content));
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
        const params: any = {keywords: this.keywords, page};
        if (this.topic) {
            params.topic = this.topic.id;
        }
        if (this.user) {
            params.user = this.user.id;
        }
        this.service.getList(params).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            res.data = res.data.map(i => {
                i.attachment_current = 0;
                i.blcokItems = this.service.renderRule(i.content, i.extra_rule);
                return i;
            });
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}
