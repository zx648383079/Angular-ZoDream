import { Component, OnInit, inject } from '@angular/core';
import { IShortLink } from '../model';
import { IPageQueries } from '../../../theme/models/page';
import { ShortLinkService } from './short-link.service';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';

@Component({
    standalone: false,
    selector: 'app-short-member',
    templateUrl: './short-member.component.html',
    styleUrls: ['./short-member.component.scss']
})
export class ShortMemberComponent implements OnInit {
    private service = inject(ShortLinkService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IShortLink[] = [];
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public editData: IShortLink = {} as any;

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.queries = this.searchService.getQueries(res, this.queries);
            this.tapPage();
        });
    }

    public tapEdit(modal: DialogEvent, item?: IShortLink) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            title: '',
            source_url: ''
        };
        modal.open(() => {
            this.service.linkSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.source_url);
        });
    }

    public tapRefresh() {
        this.goPage(1);
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
        this.service.linkList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
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

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapRemove(item: IShortLink) {
        this.toastrService.confirm($localize `Are you sure to delete the "${item.title}"?`, () => {
            this.service.linkRemove(item.id).subscribe(res => {
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
