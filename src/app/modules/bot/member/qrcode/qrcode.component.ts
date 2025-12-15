import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IBotQr } from '../../model';
import { BotService } from '../bot.service';

@Component({
    standalone: false,
    selector: 'app-bot-m-qrcode',
    templateUrl: './qrcode.component.html',
    styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
    private readonly service = inject(BotService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IBotQr[] = [];

    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public selected = 0;
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20
    }));

    public readonly editForm = form(signal({
        scene_type: 0,
        scene_str: ''
    }), schemaPath => {
        required(schemaPath.scene_str);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: any) {
        this.editForm().value.update(v => {
            v.scene_type = item?.scene_type ?? 0;
            v.scene_str = item?.scene_str ?? '';
            return v;
        });
        modal.open(() => {
            this.service.qrcodeSave(this.editForm().value()).subscribe({
                next: _ => {
                    this.toastrService.success('添加成功');
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            })
        }, () => this.editForm().valid());
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
        this.service.qrcodeList(queries).subscribe({
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

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”二维码？', () => {
            this.service.qrcodeRemove(item.id).subscribe(res => {
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
