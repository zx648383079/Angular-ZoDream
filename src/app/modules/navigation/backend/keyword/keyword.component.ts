import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { mapFormat } from '../../../../theme/utils';
import { emptyValidate } from '../../../../theme/validators';
import { IWebPageKeywords } from '../../model';
import { NavigationService } from '../navigation.service';

@Component({
    standalone: false,
    selector: 'app-keyword',
    templateUrl: './keyword.component.html',
    styleUrls: ['./keyword.component.scss']
})
export class KeywordComponent implements OnInit {
    private readonly service = inject(NavigationService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: IWebPageKeywords[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
    }));
    public typeItems = ['词语', '长尾词'];
    public readonly editForm = form(signal({
        id: 0,
        word: '',
        type: '0',
    }), schemaPath => {
        required(schemaPath.word);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public formatType(v: number) {
        return mapFormat(v, this.typeItems);
    }

    public open(modal: DialogEvent, item?: IWebPageKeywords) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.word = item?.word ?? '';
            v.type = item?.type as any ?? '0';
            return v;
        });
        modal.open(() => {
            this.service.keywordSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries().value(), page};
        this.service.keywordList(queries).subscribe({
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

    public tapRemove(item: IWebPageKeywords) {
        this.toastrService.confirm('确定删除“' + item.word + '”关键词？', () => {
            this.service.keywordRemove(item.id).subscribe(res => {
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
