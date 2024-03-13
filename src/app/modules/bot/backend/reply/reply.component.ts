import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { EditorTypeItems, EventItems, IBotReply } from '../../model';
import { BotService } from '../bot.service';

@Component({
  selector: 'app-bot-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

    public items: IBotReply[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public tabItems: IItem[] = [
        {name: '关键词回复', value: 'message'},
        {name: '收到消息回复', value: 'default'},
        {name: '被关注回复', value: 'subscribe'},
    ];
    public queries: IPageQueries = {
        event: this.tabItems[0].value,
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: any = {};

    constructor(
        private service: BotService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public formatEvent(val: string) {
        return mapFormat(val, EventItems);
    }

    public formatType(val: any) {
        return mapFormat(val, EditorTypeItems);
    }

    public onStatusChange(item: IBotReply) {
        this.service.replyUpdate(item.id, {
            status: item.status
        }).subscribe({
            next: _ => {
                this.toastrService.success('修改成功');
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }
    
    public tapTab(i: any = '') {
        this.queries.event = i;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.replyList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”回复？', () => {
            this.service.replyRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
