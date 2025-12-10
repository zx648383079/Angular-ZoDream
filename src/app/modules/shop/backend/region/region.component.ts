import { Component, OnInit, inject } from '@angular/core';
import {
    ActivatedRoute
} from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import {
    IRegion
} from '../../model';
import { SearchService } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import {
    RegionService
} from '../region.service';

@Component({
    standalone: false,
    selector: 'app-region',
    templateUrl: './region.component.html',
    styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {
    private service = inject(RegionService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IRegion[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public parent: IRegion;
    public editData: IRegion = {} as any;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        parent: 0,
    };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
            if (this.queries.parent < 1) {
                return;
            }
            this.service.region(this.queries.parent).subscribe(data => {
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
        this.service.regionList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.searchService.applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IRegion) {
        this.toastrService.confirm('确定删除“' + item.name + '”地区？', () => {
            this.service.regionRemove(item.id).subscribe(res => {
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

    public tapViewRegion(item?: IRegion) {
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
        this.service.region(parentId).subscribe(res => {
            this.tapViewRegion(res);
        });
    }

    open(modal: DialogEvent, item?: IRegion) {
        this.editData = item ? {...item} : {
            id: undefined,
            name: ''
        };
        modal.open(() => {
            this.service.regionSave({
                name: this.editData.name,
                parent_id: this.parent?.id,
                full_name: (this.parent ? this.parent.full_name + ' ' : '') + this.editData.name,
                id: this.editData?.id
            }).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => !emptyValidate(this.editData.name));
    }
}
