import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { ICmsLinkageData } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
    standalone: false,
    selector: 'app-linkage-data',
    templateUrl: './linkage-data.component.html',
    styleUrls: ['./linkage-data.component.scss']
})
export class LinkageDataComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<ICmsLinkageData[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        linkage: 0,
        page: 1,
        per_page: 20,
        keywords: ''
    }));
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        description: '',
        thumb: '',
        position: 99,
        parent_id: 0,
        linkage_id: 0
    }), schemaPath => {
        required(schemaPath.name);
    });
    public typeItems = ['栏目', '内容'];
    public path: ICmsLinkageData[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.linkage) {
                this.queries.linkage().value.set(parseInt(params.linkage, 10));
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public get parentId() {
        return this.path.length < 1 ? 0 : this.path[this.path.length - 1].id;
    }

    public tapParent(item: ICmsLinkageData) {
        this.path.push(item);
        this.tapRefresh();
    }

    public open(modal: DialogEvent, item?: ICmsLinkageData) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.description = item?.description ?? '';
            v.thumb = item?.thumb ?? '';
            v.position = item?.position ?? 99;
            v.parent_id = item?.parent_id ?? this.parentId;
            v.linkage_id = this.queries.linkage().value() as any;
            return v;
        });
        modal.open(() => {
            this.service.linkageDataSave(this.editForm().value()).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => this.editForm().valid());
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
        this.service.linkageDataList({...queries, parent: this.parentId}).subscribe(res => {
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

    public tapRemove(item: ICmsLinkageData) {
        this.toastrService.confirm('确定删除“' + item.name + '”联动项？', () => {
            this.service.linkageDataRemove(item.id).subscribe(res => {
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
