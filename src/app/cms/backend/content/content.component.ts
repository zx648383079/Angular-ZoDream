import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { formatAgo } from '../../../theme/utils';
import { ICmsColumn, ICmsContent } from '../../model';
import { CmsService } from '../cms.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    public items: ICmsContent[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };
    public site = 0;
    public category = 0;
    public columnItems: ICmsColumn[] = [];

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) {
        
    }
  
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.site = parseInt(params.site, 10);
            this.category = parseInt(params.category, 10);
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public formatColumn(item: ICmsContent, field: ICmsColumn) {
        if (field.name === 'cat_id') {
            return item.category?.title;
        }
        if (['created_at', 'updated_at'].indexOf(field.name) >= 0) {
            return formatAgo(item[field.name]);
        }
        return item[field.name];
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
        this.service.contentList({...queries, site: this.site, category: this.category}).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
            this.columnItems = (res as any).column;
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }
  
    public tapRemove(item: ICmsContent) {
        if (!confirm('确定删除“' + item.title + '”内容？')) {
            return;
        }
        this.service.contentRemove(this.site, this.category, item.id).subscribe(res => {
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
