import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
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
    private readonly service = inject(ShortLinkService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IShortLink[] = [];
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
    }));
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly editForm = form(signal<IShortLink>({
        id: 0,
        title: '',
        source_url: ''
    }), schemaPath => {
        required(schemaPath.source_url);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(res => {
            this.searchService.getQueries(res, this.queries);
            this.tapPage();
        });
    }

    public tapEdit(modal: DialogEvent, item?: IShortLink) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.title = item?.title ?? '';
            v.source_url = item?.source_url ?? '';
            return v;
        });
        modal.open(() => {
            this.service.linkSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapPage();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.linkList(queries).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = res.data;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
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
