import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { applyHistory, getQueries } from '../../../../theme/query';
import { emptyValidate } from '../../../../theme/validators';
import { IWebPage, IWebPageKeywords } from '../../model';
import { formatDomain } from '../../util';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

    public items: IWebPage[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        site: 0,
        user: 0,
    };
    public editData: IWebPage = {} as any;
    public wordItems$: Observable<IWebPageKeywords[]>;
    public wordInput$ = new Subject<string>();
    public wordLoading = false;

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
        this.wordItems$ = concat(
            of([]), // default items
            this.wordInput$.pipe(
                distinctUntilChanged(),
                tap(() => this.wordLoading = true),
                switchMap(keywords => this.service.keywordList({keywords}).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.wordLoading = false),
                    map(res => res instanceof Array ? res : res.data)
                ))
            )
        );
    }

    public formatDomain(v: string) {
        return formatDomain(v);
    }

    public addWordFn(word: string) {
        return {word};
    }

    public open(modal: DialogEvent, item?: IWebPage) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            title: '',
            description: '',
            link: '',
            thumb: '',
            site_id: 0,
            score: 60,
            keywords: [],
        };
        modal.open(() => {
            this.service.pageSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.title) && !emptyValidate(this.editData.link);
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.pageList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                applyHistory(this.queries = queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IWebPage) {
        this.toastrService.confirm('确定删除“' + item.title + '”网页？', () => {
            this.service.pageRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success('删除成功');
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }
}
