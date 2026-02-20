import { form, required } from '@angular/forms/signals';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IAuthorize } from '../../../theme/models/open';
import { OpenService } from '../open.service';
import { SearchService } from '../../../theme/services';
import { ArraySource } from '../../../components/form';

@Component({
    standalone: false,
    selector: 'app-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent {
    private readonly service = inject(OpenService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IAuthorize[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: ''
    }));
    public readonly platformItems = signal(ArraySource.empty);
    public readonly editForm = form(signal({
        platform_id: 0,
        expired_at: '',
    }), schemaPath => {
        required(schemaPath.platform_id);
    });

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
        this.service.authorizePlatform().subscribe(res => {
            this.platformItems.set(new ArraySource(res.data));
        });
    }

    public open(modal: DialogEvent) {
        modal.open(() => {
            this.service.authorizeCreate(this.editForm).subscribe({
                next: res => {
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
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
        this.service.authorizeList(queries).subscribe({
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

    public tapSearch(e: Event) {
        e.preventDefault();
        this.tapRefresh();
    }

    public tapClear() {
        this.toastrService.confirm('确定清除所有的授权Token？', () => {
            this.service.authorizeClear().subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapRefresh();
            });
        });
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除这一条授权Token？', () => {
            this.service.authorizeRemove(item.id).subscribe(res => {
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
