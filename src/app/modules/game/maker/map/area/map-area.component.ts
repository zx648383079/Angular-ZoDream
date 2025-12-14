import { Component, OnInit, inject } from '@angular/core';
import { IGameMapArea } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { GameMakerService } from '../../game-maker.service';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { emptyValidate } from '../../../../../theme/validators';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    standalone: false,
  selector: 'app-maker-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.scss']
})
export class MapAreaComponent implements OnInit {
    private readonly service = inject(GameMakerService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IGameMapArea[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public parent: IGameMapArea;
    public editData: IGameMapArea = {} as any;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        parent: 0,
        project: 0,
    };

    ngOnInit() {
        this.route.parent.params.subscribe(params => {
            this.queries.project = parseNumber(params.game);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
            if (this.queries.parent < 1) {
                return;
            }
            this.service.mapArea(this.queries.parent, this.queries.project).subscribe(data => {
                this.parent = data;
            });
        });
    }

    /**
     * tapRefresh
     */
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
        this.service.mapAreaList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
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

    public tapRemove(item: IGameMapArea) {
        this.toastrService.confirm('确定删除“' + item.name + '”地区？', () => {
            this.service.mapAreaRemove(item.id, this.queries.project).subscribe(res => {
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

    public tapViewRegion(item?: IGameMapArea) {
        this.parent = item;
        this.queries.parent = item?.id || 0;
        this.queries.keywords = '';
        this.tapRefresh();
    }

    public tapParentRegion() {
        const parentId = this.parent ? this.parent.parent_id : 0;
        if (parentId < 1) {
            this.tapViewRegion();
            return;
        }
        this.service.mapArea(parentId, this.queries.project).subscribe(res => {
            this.tapViewRegion(res);
        });
    }

    public open(modal: DialogEvent, item?: IGameMapArea) {
        this.editData = item ? {...item} : {
            id: undefined,
            name: ''
        } as any;
        modal.open(() => {
            this.service.mapAreaSave({
                name: this.editData.name,
                parent_id: this.parent?.id,
                id: this.editData?.id,
                project_id: this.queries.project
            }).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => !emptyValidate(this.editData.name));
    }

}
