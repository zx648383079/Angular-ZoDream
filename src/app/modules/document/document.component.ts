import { form } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestChangeEvent } from '../../components/form';
import { IPageQueries } from '../../theme/models/page';
import { SearchService } from '../../theme/services';
import { ThemeService } from '../../theme/services';
import { DocumentService } from './document.service';
import { IProject } from './model';

@Component({
    standalone: false,
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
    private readonly service = inject(DocumentService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly themeService = inject(ThemeService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IProject[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: ''
    }));

    constructor() {
        this.themeService.titleChanged.next($localize `Document`);
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            if (!this.queries.keywords) {
                this.tapRefresh();
                return;
            }
            this.tapPage();
        });

    }

    public tapRefresh() {
        this.service.projectList({}).subscribe(res => {
            this.items.set(res.data);
        });
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
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
        this.queries.keywords().value.set(value);
        this.goPage(1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.projectList(queries).subscribe({
            next: res => {
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
