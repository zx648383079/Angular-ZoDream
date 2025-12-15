import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { IBotMedia, MediaTypeItems } from '../../model';
import { BotService } from '../bot.service';

@Component({
    standalone: false,
  selector: 'app-bot-m-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IBotMedia[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public tabItems: IItem[] = [
        {name: '图片素材', value: 'image'},
        {name: '语音素材', value: 'voice'},
        {name: '视频素材', value: 'video'},
        {name: '图文素材', value: 'news'},
    ];
    public readonly queries = form(signal<IPageQueries>({
        type: this.tabItems[0].value,
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

    public formatType(val: string) {
        return mapFormat(val, MediaTypeItems);
    }

    public formatPublishStatus(val: number) {
        return mapFormat(val, [
            {name: '草稿', value: 6},
            {name: '发布中', value: 7},
            {name: '已发布', value: 8},
        ])
    }

    public open(modal: DialogEvent) {
        this.editForm = {
            title: '',
            type: 'image',
            material_type: 0
        };
        modal.open(() => {
            this.service.mediaSave(this.editForm().value()).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => !emptyValidate(this.editForm.content));
    }

    public tapPull(e?: ButtonEvent) {
        this.toastrService.confirm('确定要拉取公众号永久素材？', () => {
            e?.enter();
            this.service.mediaPull({
                type: this.queries.type
            }).subscribe({
                next: _ => {
                    e?.reset();
                    this.toastrService.success('拉取成功！');
                    this.tapRefresh();
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            })
        });
    }

    public tapTab(i: any) {
        this.queries.type = i;
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
        this.service.mediaList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapAsync(item: IBotMedia) {
        this.toastrService.confirm('确定推送“' + item.title + '”素材到公众号？', () => {
            this.service.mediaAsync(item.id).subscribe({
                next: res => {
                    if (!res.data) {
                        return;
                    }
                    this.tapPage();
                    this.toastrService.success('推送成功');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapRemove(item: IBotMedia) {
        this.toastrService.confirm('确定删除“' + item.title + '”素材？', () => {
            this.service.mediaRemove(item.id).subscribe({
                next: res => {
                    if (!res.data) {
                        return;
                    }
                    this.toastrService.success($localize `Delete Successfully`);
                    this.items = this.items.filter(it => {
                        return it.id !== item.id;
                    });
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapCopy(val: string, e: MouseEvent) {
        navigator.clipboard.writeText(val).then(
            () => {
                this.toastrService.success($localize `Copy successfully`);
            },
            () => {
                this.toastrService.warning($localize `Copy failed`);
            }
        );
    }

}
