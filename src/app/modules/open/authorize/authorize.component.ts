import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { IAuthorize, IPlatform } from '../../../theme/models/open';
import { IPageQueries } from '../../../theme/models/page';
import { OpenService } from '../open.service';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {
    private readonly service = inject(OpenService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly searchService = inject(SearchService);


    public items: IAuthorize[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: ''
    }));
    public platformItems: IPlatform[] = [];
    public readonly editForm = form(signal({
        platform_id: 0,
        expired_at: '',
    }), schemaPath => {
        required(schemaPath.platform_id);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
        this.service.authorizePlatform().subscribe(res => {
            this.platformItems = res.data;
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
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.authorizeList(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

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
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
