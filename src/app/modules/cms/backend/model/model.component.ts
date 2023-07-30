import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { ICmsModel } from '../../model';
import { CmsService } from '../cms.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit {

    public items: ICmsModel[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public typeItems = ['实体', '表单'];
    public siteId = 0;

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.site) {
                return;
            }
            this.siteId = parseInt(params.site, 10);
        });
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
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
        this.service.modelList(queries).subscribe({
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

    public tapRestart(item: ICmsModel) {
        this.toastrService.confirm('您确定重新生成此模块，如果当前站点包含此模块，将删除此站点在此模块中的数据，确认则继续此操作?', () => {
            this.service.modelRestart({
                site: this.siteId,
                id: item.id
            }).subscribe({
                next: res => {
                    this.toastrService.success('初始化完成');
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapRemove(item: ICmsModel) {
        this.toastrService.confirm('模型是所有站点公用的，确定删除“' + item.name + '”模型？', () => {
            this.service.modelRemove(item.id).subscribe(res => {
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
