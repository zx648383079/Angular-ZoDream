import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { emptyValidate } from '../../../../../theme/validators';
import { ICmsLinkageData } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
    standalone: false,
    selector: 'app-linkage-data',
    templateUrl: './linkage-data.component.html',
    styleUrls: ['./linkage-data.component.scss']
})
export class LinkageDataComponent implements OnInit {

    public items: ICmsLinkageData[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        linkage: 0,
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public editData: ICmsLinkageData = {} as any;
    public typeItems = ['栏目', '内容'];
    public path: ICmsLinkageData[] = [];

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.linkage) {
                this.queries.linkage = parseInt(params.linkage, 10);
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
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
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            description: '',
            thumb: '',
            position: 99,
            parent_id: this.parentId,
            linkage_id: this.queries.linkage
        };
        modal.open(() => {
            this.service.linkageDataSave(this.editData).subscribe(_ => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapRefresh();
            });
        }, () => !emptyValidate(this.editData.name));
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
        this.service.linkageDataList({...queries, parent: this.parentId}).subscribe(res => {
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

    public tapRemove(item: ICmsLinkageData) {
        this.toastrService.confirm('确定删除“' + item.name + '”联动项？', () => {
            this.service.linkageDataRemove(item.id).subscribe(res => {
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
