import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { applyHistory, getQueries } from '../../../theme/query';
import { mapFormat } from '../../../theme/utils';
import { EditorTypeItems, EventItems, IWeChatReply } from '../../model';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

    public items: IWeChatReply[] = [];

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
    public editData: any;

    constructor(
        private service: WechatService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public formatEvent(val: string) {
        return mapFormat(val, EventItems);
    }

    public formatType(val: string) {
        return mapFormat(val, EditorTypeItems);
    }

    public open(modal: DialogEvent, item?: any) {
        this.editData = item ? {...item} : {event: this.queries.event, type: 0};
        modal.open(() => {
            this.service.replySave(this.editData).subscribe({
                next: _ => {
                    if (item) {
                        this.tapPage();
                    } else {
                        this.tapRefresh();
                    }
                    this.toastrService.success('保存成功');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }
    
    public tapTab(i = '') {
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
                applyHistory(this.queries = queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”公众号？', () => {
            this.service.replyRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
        
    }

}
