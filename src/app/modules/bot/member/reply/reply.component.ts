import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { EditorTypeItems, EventItems, IBotReply } from '../../model';
import { BotService } from '../bot.service';

@Component({
    standalone: false,
    selector: 'app-bot-m-reply',
    templateUrl: './reply.component.html',
    styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IBotReply[]>([]);

    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
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
    public readonly editForm = form(signal<IBotReply>({
        id: 0,
        event: '', 
        type: 0
    } as any), schemaPath => {
        required(schemaPath.event);
    });

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

    public open(modal: DialogEvent, item?: any) {
        this.editForm().value.update(v => {
            v.event = item?.event ?? '';
            v.type = item?.type ?? 0;
            return {...v};
        });
        modal.open(() => {
            this.service.replySave(this.editForm().value()).subscribe({
                next: _ => {
                    if (item) {
                        this.tapPage();
                    } else {
                        this.tapRefresh();
                    }
                    this.toastrService.success($localize `Save Successfully`);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
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
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.replyList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”回复？', () => {
            this.service.replyRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }

}
