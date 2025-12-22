import { form } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(DocumentService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
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

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
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

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IProject) {
        this.toastrService.confirm('确定删除“' + item.name + '”文档？', () => {
            this.service.projectRemove(item.id).subscribe(res => {
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
