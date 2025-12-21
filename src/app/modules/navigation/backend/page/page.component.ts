import { form, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { IWebPage, IWebPageKeywords } from '../../model';
import { formatDomain } from '../../util';
import { NavigationService } from '../navigation.service';

@Component({
    standalone: false,
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
    private readonly service = inject(NavigationService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IWebPage[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        per_page: 20,
        keywords: '',
        site: 0,
        user: 0,
    }));
    public readonly editForm = form(signal<IWebPage>({
        id: 0,
        title: '',
        description: '',
        link: '',
        thumb: '',
        site_id: 0,
        score: 60,
        keywords: [],
    }), schemaPath => {
        required(schemaPath.title);
        required(schemaPath.link);
    });
    public editExistData: IWebPage|undefined;
    public wordItems$: Observable<IWebPageKeywords[]>;
    public wordInput$ = new Subject<string>();
    public wordLoading = false;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
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

    public onLinkBlur() {
        if (!this.editForm.link) {
            return;
        }
        this.service.pageCheck(this.editForm).subscribe(res => {
            this.editExistData = res.data;
        });
    }

    public open(modal: DialogEvent, item?: IWebPage) {
        this.editExistData = undefined;
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.title = item?.title ?? '';
            v.description = item?.description ?? '';
            v.link = item?.link ?? '';
            v.thumb = item?.thumb ?? '';
            v.site_id = item?.site_id ?? 0;
            v.score = item?.score ?? 60;
            v.keywords = item?.keywords ?? [];
            return v;
        });
        modal.open(() => {
            this.service.pageSave(this.editForm().value()).subscribe({
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
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.pageList(queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

        this.tapRefresh();
    }

    public tapRemove(item: IWebPage) {
        this.toastrService.confirm('确定删除“' + item.title + '”网页？', () => {
            this.service.pageRemove(item.id).subscribe(res => {
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
