import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(RegionService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IRegion[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public parent: IRegion;
    public readonly editForm = form(signal<IRegion>({
        id: 0,
        name: ''
    }), schemaPath => {
        required(schemaPath.name);
    });
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        parent: 0,
    }));

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
            if (this.queries.parent().value() < 1) {
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
        this.service.regionList(queries).subscribe(res => {
            this.isLoading.set(false);
            this.items.set(res.data);
            this.hasMore = res.paging.more;
            this.total.set(res.paging.total);
            this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
        });
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapRemove(item: IRegion) {
        this.toastrService.confirm('确定删除“' + item.name + '”地区？', () => {
            this.service.regionRemove(item.id).subscribe(res => {
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

    public tapViewRegion(item?: IRegion) {
        this.parent = item;
        this.queries().value.update(v => {
            v.parent = item?.id || 0;
            v.keywords = '';
            return {...v};
        });
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
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            return {...v};
        });
        modal.open(() => {
            this.service.regionSave({
                name: this.editForm.name,
                parent_id: this.parent?.id,
                full_name: (this.parent ? this.parent.full_name + ' ' : '') + this.editForm.name,
                id: this.editForm?.id
            }).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => this.editForm().valid());
    }
}
