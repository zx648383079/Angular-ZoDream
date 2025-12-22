import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { IGameMapItem } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { GameMakerService } from '../../game-maker.service';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-map-item',
    templateUrl: './map-item.component.html',
    styleUrls: ['./map-item.component.scss']
})
export class MapItemComponent implements OnInit {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IGameMapItem[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0,
        map: 0,
    }));
    public readonly editForm = form(signal<IGameMapItem>({
        id: 0,
        map_id: 0,
        item_type: 0,
        item_id: 0,
        amount: 0,
        refresh_time: 0,
    }));

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project().value.set(parseNumber(params.game));
        });
        this.route.params.subscribe(params => {
            this.queries.map().value.set(parseNumber(params.map));
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }


    public open(modal: DialogEvent, item?: IGameMapItem) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.map_id = this.queries.map().value() as any;
            v.item_type = item?.item_type ?? 0;
            v.item_id = item?.item_id ?? 0;
            v.amount = item?.amount ?? 0;
            v.refresh_time = item?.refresh_time ?? 0;
            return v;
        });
        modal.open(() => {
            this.service.mapSave({...this.editForm().value(), project_id: this.queries.project}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.mapItemList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            this.searchService.applyHistory(queries, ['project']);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IGameMapItem) {
        this.toastrService.confirm('确定删除“' + item.item.name + '”物品？', () => {
            this.service.mapItemRemove(item.id, this.queries.project).subscribe(res => {
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
