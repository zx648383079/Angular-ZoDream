import { Component, OnInit } from '@angular/core';
import { IProject } from '../model';
import { IPageQueries } from '../../../theme/models/page';
import { DocumentService } from './document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-document-member',
    templateUrl: './document-member.component.html',
    styleUrls: ['./document-member.component.scss']
})
export class DocumentMemberComponent implements OnInit {

    public items: IProject[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: ''
    };

    constructor(
        private service: DocumentService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private router: Router,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public tapBack() {
        history.back();
    }

    public tapItem(item: IProject) {
        this.router.navigate([item.type > 0 ? 'api' : 'page', item.id], {relativeTo: this.route});
    }

    public tapRefresh() {
        this.goPage(1);
    }
    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.projectList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
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

    public tapRemove(item: IProject) {
        this.toastrService.confirm('确定删除“' + item.name + '”文档？', () => {
            this.service.projectRemove(item.id).subscribe(res => {
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
