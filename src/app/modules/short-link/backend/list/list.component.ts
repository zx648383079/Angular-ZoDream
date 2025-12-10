import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { IItem } from '../../../../theme/models/seo';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { IShortLink } from '../../model';
import { ShortLinkService } from '../short-link.service';

@Component({
    standalone: false,
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    private service = inject(ShortLinkService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IShortLink[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        user: 0,
        status: 0,
        page: 1,
        per_page: 20
    };
    public editData: IShortLink = {} as any;
    public statusItems: IItem[] = [
        {name: '待审核', value: 0},
        {name: '正常', value: 5},
        {name: '过期', value: 7},
        {name: '禁止', value: 9},
    ]

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }


    public formatStatus(v: number) {
        return mapFormat(v, this.statusItems);
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

    /**
     * tapRefresh
     */
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
        this.service.linkList(queries).subscribe({
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

    public tapRemove(item: IShortLink) {
        this.toastrService.confirm('确定删除“' + item.source_url + '”链接？', () => {
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
