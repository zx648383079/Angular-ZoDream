import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as ClipboardJS from 'clipboard';
import { DialogEvent, DialogService } from '../../../dialog';
import { ButtonEvent } from '../../../form';
import { IPageQueries } from '../../../theme/models/page';
import { IItem } from '../../../theme/models/seo';
import { applyHistory, getQueries } from '../../../theme/query';
import { mapFormat } from '../../../theme/utils';
import { emptyValidate } from '../../../theme/validators';
import { IWeChatMedia, MediaTypeItems } from '../../model';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

    public items: IWeChatMedia[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public tabItems: IItem[] = [
        {name: '图片素材', value: 'image'},
        {name: '语音素材', value: 'voice'},
        {name: '视频素材', value: 'video'},
        {name: '图文素材', value: 'news'},
    ];
    public queries: IPageQueries = {
        type: this.tabItems[0].value,
        keywords: '',
        page: 1,
        per_page: 20
    };
    public editData: any = {};

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

    public formatType(val: string) {
        return mapFormat(val, MediaTypeItems);
    }

    public open(modal: DialogEvent) {
        this.editData = {
            title: '',
            type: 'image',
            material_type: 0
        };
        modal.open(() => {
            this.service.mediaSave(this.editData).subscribe({
                next: _ => {
                    this.toastrService.success('保存成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => !emptyValidate(this.editData.content));
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

    public tapTab(i: string) {
        this.queries.type = i;
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
        this.service.mediaList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapAsync(item: IWeChatMedia) {
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

    public tapRemove(item: IWeChatMedia) {
        this.toastrService.confirm('确定删除“' + item.title + '”素材？', () => {
            this.service.mediaRemove(item.id).subscribe({
                next: res => {
                    if (!res.data) {
                        return;
                    }
                    this.toastrService.success('删除成功');
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
        const clipboard: any = new ClipboardJS(e.currentTarget as HTMLDivElement, {
            text: () => {
              return val;
            },
        });
        clipboard.on('success', (e) => {
            this.toastrService.success($localize `Copy successfully`);
            e.clearSelection();
        });
        clipboard.on('error', (e) => {
            this.toastrService.warning($localize `Copy failed`);
        });
        clipboard.onClick(e);
    }

}
