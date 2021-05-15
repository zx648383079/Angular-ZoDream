import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogBoxComponent, DialogService } from '../../../../dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { applyHistory, getQueries } from '../../../../theme/query';
import { emptyValidate } from '../../../../theme/validators';
import { ICmsLinkage, ICmsLinkageData } from '../../../model';
import { CmsService } from '../../cms.service';

@Component({
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
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.linkage) {
                this.queries.linkage = parseInt(params.linkage, 10);
            }
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
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

    public open(modal: DialogBoxComponent, item?: ICmsLinkageData) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            position: 99,
            parent_id: this.parentId,
            linkage_id: this.queries.linkage
        };
        modal.open(() => {
            this.service.linkageDataSave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
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
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ICmsLinkage) {
        if (!confirm('确定删除“' + item.name + '”联动？')) {
            return;
        }
        this.service.linkageDataRemove(item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
