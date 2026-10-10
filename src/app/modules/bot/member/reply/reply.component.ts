import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
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
export class ReplyComponent {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IBotReply[]>([]);

    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly tabItems: IItem[] = [
        {name: '关键词回复', value: 'message'},
        {name: '收到消息回复', value: 'default'},
        {name: '被关注回复', value: 'subscribe'},
    ];
    public readonly queries = form(signal({
        event: this.tabItems[0].value,
        keywords: '',
        page: 1,
        per_page: 20
    }));
    public readonly editForm = form(signal({
        id: 0,
        title: '',
        event: '', 
        type: 0,
        match: 0,
        keywords: '',
        event_name: '',
        start_at: '',
        end_at: '',
        body: this.service.parseEditor(null),
        status: 0,
    }), schemaPath => {
        required(schemaPath.event);
    });

    public readonly eventItems: IItem[] = EventItems;
    public readonly typeItems: IItem[] = EditorTypeItems;

    constructor() {
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

    public open(modal: DialogEvent, item?: IBotReply) {
        this.editForm().value.update(v => {
            v.event = item?.event ?? '';
            v.type = item?.type ?? 0;
            v.title = item?.title ?? '';
            v.match = item?.match ?? 0;
            v.keywords = item?.keywords ?? '';
            v.start_at = item?.start_at ?? '';
            v.end_at = item?.end_at ?? '';
            v.body = this.service.parseEditor(item);
            v.status = item?.status ?? 0;
            return {...v};
        });
        modal.open(() => {
            const data = this.editForm().value();
            this.service.replySave({...data, ...this.service.renderEditor(data.body)}).subscribe({
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

    public tapRemove(item: IBotReply) {
        this.toastrService.confirm('确定删除“' + item.title + '”回复？', () => {
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
