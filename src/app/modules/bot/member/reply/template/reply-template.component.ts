import { form, readonly, required } from '@angular/forms/signals';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ButtonEvent } from '../../../../../components/form';
import { IPage, IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { IBotReplyTemplate, IBotReplyTemplateField, IBotUser } from '../../../model';
import { formatTemplateField, renderTemplateField } from '../../../util';
import { BotService } from '../../bot.service';



@Component({
    standalone: false,
    selector: 'app-reply-template',
    templateUrl: './reply-template.component.html',
    styleUrls: ['./reply-template.component.scss']
})
export class ReplyTemplateComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IBotReplyTemplate[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public selected = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public readonly editForm = form(signal({
        id: 0,
        template_id: '',
        content: '',
        title: '',
        example: '',
        status: false,
    }), schemaPath => {
        required(schemaPath.template_id);
        required(schemaPath.content);
    });
    public sendForm = form(signal({
        to_type: 0,
        template: {
            title: '',
            status: false,
            content: ''
        },
        to: 0,
        title: '',
        template_url: '',
        appid: '',
        path: '',
        content: '',
        items: <IBotReplyTemplateField[]>[]
    }), schemaPath => {
        readonly(schemaPath.content);
    });

    public formatUser = (res: IPage<IBotUser>) => {
        return res.data.map(i => {
            return {
                id: i.id,
                name: i.note_name || i.nickname
            };
        });
    };

    public readonly selectUrl = computed(() => {
        switch (this.sendForm.to_type().value()) {
            case 2:
                return 'wx/admin/user/search?wid=' + this.service.baseId;
            case 1:
                return 'wx/admin/user/group_search?wid=' + this.service.baseId;
            default:
                return null;
        }
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public tapEdit(modal: DialogEvent, item?: IBotReplyTemplate) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.template_id = item?.template_id ?? '';
            v.content = item?.content ?? '';
            return v;
        });
        modal.open(() => {
            this.service.wxTemplateSave(this.editForm().value()).subscribe({
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

    public tapRemove(item: IBotReplyTemplate) {
        this.toastrService.confirm('确定删除“' + item.title + '”模板？', () => {
            this.service.wxTemplateRemove(item.id).subscribe(res => {
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

    public open(modal: DialogEvent, item: IBotReplyTemplate) {
        this.sendForm().value.update(v => {
            v.template = {
                title: item.title,
                status: item.status > 0,
                content: item.content,
            };
            v.items = formatTemplateField(item.content);
            v.to_type = 2;
            v.to = 0
            return v;
        });
        modal.open(() => {
            const data = this.sendForm().value();
            this.service.send({
                to_type: 2,
                to: data.to,
                type: 3,
                content: {
                    template_id: item.template_id,
                    template_url: data.template_url,
                    appid: data.appid,
                    path: data.path,
                    template_data: data.items,
                }
            }).subscribe({
                next: _ => {
                    this.toastrService.success('发送成功');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        });
        this.onFieldChange();
    }

    public onFieldChange() {
        this.sendForm().value.update(v => {
            v.content = renderTemplateField(v.template.content, v.items);
            return v;
        });
    }

    public tapAsync(e?: ButtonEvent) {
        this.toastrService.confirm('确定要同步公众号模板？', () => {
            e?.enter();
            this.service.wxTemplateAsync().subscribe({
                next: _ => {
                    e?.reset();
                    this.toastrService.success('同步成功！');
                    this.tapRefresh();
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            })
        });
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
        this.service.wxTemplateList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

}
