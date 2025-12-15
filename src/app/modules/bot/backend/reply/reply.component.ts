import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { EditorTypeItems, EventItems, IBotReply } from '../../model';
import { BotService } from '../bot.service';

@Component({
    standalone: false,
    selector: 'app-bot-reply',
    templateUrl: './reply.component.html',
    styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IBotReply[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public tabItems: IItem[] = [
        {name: '关键词回复', value: 'message'},
        {name: '收到消息回复', value: 'default'},
        {name: '被关注回复', value: 'subscribe'},
    ];
    public readonly queries = form(signal<IPageQueries>({
        event: this.tabItems[0].value,
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public readonly editForm = form(signal<any>({}));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.queries.event().value.set(i);
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.replyList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

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
