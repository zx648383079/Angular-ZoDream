import { Component, OnInit } from '@angular/core';
import { IGameMapItem } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { GameMakerService } from '../../game-maker.service';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { parseNumber } from '../../../../../theme/utils';

@Component({
  selector: 'app-map-item',
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss']
})
export class MapItemComponent implements OnInit {

    public items: IGameMapItem[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        project: 0,
        map: 0,
    };
    public editData: IGameMapItem = {} as any;

    constructor(
        private service: GameMakerService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project = parseNumber(params.game);
        });
        this.route.params.subscribe(params => {
            this.queries.map = parseNumber(params.map);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }


    public open(modal: DialogEvent, item?: IGameMapItem) {
        this.editData = item ? {...item} : {
            map_id: this.queries.map,
        } as any;
        modal.open(() => {
            this.service.mapSave({...this.editData, project_id: this.queries.project}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
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

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.mapItemList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries, ['project']);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IGameMapItem) {
        this.toastrService.confirm('确定删除“' + item.item.name + '”物品？', () => {
            this.service.mapItemRemove(item.id, this.queries.project).subscribe(res => {
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
