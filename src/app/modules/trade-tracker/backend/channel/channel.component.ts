import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { TrackerBackendService } from '../tracker.service';
import { IChannel } from '../../model';

@Component({
    standalone: false,
    selector: 'app-tracker-backend-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {
    private readonly service = inject(TrackerBackendService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IChannel[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public readonly editForm = form(signal<IChannel>({
        id: 0,
        name: '',
        short_name: '',
        site_url: '',
    }), schemaPath => {
        required(schemaPath.name);
        required(schemaPath.short_name);
    });

    constructor() {
        this.route.queryParams.subscribe(res => {
            this.searchService.getQueries(res, this.queries().value());
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: any) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.short_name = item?.short_name ?? '';
            v.site_url = item?.site_url ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.channelSave(this.editForm().value()).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.channelList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.items.set(res.data);
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IChannel) {
        this.toastrService.confirm('确定删除“' + item.name + '”渠道？', () => {
            this.service.channelRemove(item.id).subscribe(res => {
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
