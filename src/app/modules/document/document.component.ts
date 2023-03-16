import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestChangeEvent } from '../../components/form';
import { IPageQueries } from '../../theme/models/page';
import { SearchService } from '../../theme/services';
import { ThemeService } from '../../theme/services';
import { DocumentService } from './document.service';
import { IProject } from './model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

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
        private route: ActivatedRoute,
        private router: Router,
        private themeService: ThemeService,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        this.themeService.setTitle($localize `Document`);
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            if (!this.queries.keywords) {
                this.tapRefresh();
                return;
            }
            this.tapPage();
        });
        
    }

    public tapRefresh() {
        this.service.projectList({}).subscribe(res => {
            this.items = res.data;
        });
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public onSuggestChange(e: SuggestChangeEvent) {
        this.service.suggestion({keywords: e.text}).subscribe(res => {
            e.suggest(res);
        });
    }

    public tapSearch(value: IProject|string) {
        if (typeof value === 'object') {
            this.router.navigate(['project', value.id], {relativeTo: this.route})
            return;
        }
        this.queries.keywords = value;
        this.goPage(1);
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

}
