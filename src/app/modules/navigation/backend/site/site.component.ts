import { form, min, required } from '@angular/forms/signals';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { SearchService } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import { ISite, ISiteCategory, ISiteTag } from '../../model';
import { NavigationService } from '../navigation.service';
import { parseNumber } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {
    private readonly service = inject(NavigationService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public items: ISite[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        category: '',
        user: 0,
        tag: 0,
    }));
    public categories: ISiteCategory[] = [];
    public tagItems$: Observable<ISiteTag[]>;
    public tagInput$ = new Subject<string>();
    public tagLoading = false;
    public topItems = ['无', '推荐'];
    public readonly editForm = form(signal({
        id: 0,
        name: '',
        logo: '',
        description: '',
        cat_id: '',
        schema: 'https',
        domain: '',
        top_type: '0',
        tags: [],
        also_page: 0,
        keywords: '',
    }), schemaPath => {
        required(schemaPath.name);
    });
    public editExistData: ISite|undefined;
    public readonly scoringForm = form(signal({
        score: 60,
        change_reason: '',
    }), schemaPath => {
        required(schemaPath.change_reason);
        min(schemaPath.score, 1);
    });

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
        this.tagItems$ = concat(
            of([]), // default items
            this.tagInput$.pipe(
                distinctUntilChanged(),
                tap(() => this.tagLoading = true),
                switchMap(keywords => this.service.tagList({keywords}).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.tagLoading = false),
                    map(res => res instanceof Array ? res : res.data)
                ))
            )
        );
    }

    public addTagFn(name: string) {
        return {name};
    }

    public tapScoring(modal: DialogEvent, item: ISite) {
        this.scoringForm().value.set({
            score: item.score,
            change_reason: '',
        });
        modal.open(() => {
            this.service.siteScoring({
                ...this.scoringForm().value(),
                id: item.id
            }).subscribe({
                next: res => {
                    item.score = res.score;
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.scoringForm().valid());
    }

    public onLinkBlur() {
        const link = this.editForm.domain().value();
        if (!link) {
            return;
        }
        const i = link.indexOf('//');
        if (i >= 0) {
            this.editForm.domain().value.set(link.substring(i + 2).replace(/\/+$/, ''));
        }
        if (i > 2) {
            this.editForm.schema().value.set(link.substring(0, i - 1));
        }
        this.service.siteCheck(this.editForm).subscribe(res => {
            this.editExistData = res.data;
        });
    }

    public open(modal: DialogEvent, item?: ISite) {
        this.editExistData = undefined;
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            v.logo = item?.logo ?? '';
            v.description = item?.description ?? '';
            v.cat_id = this.queries.category().value();
            v.schema = item?.schema ?? 'https';
            v.domain = item?.domain ?? '';
            v.top_type = item?.top_type as any ?? '';
            v.tags = item?.tags ?? [];
            v.also_page = 0;
            v.keywords = '';
            return v;
        });
        modal.open(() => {
            this.service.siteSave(this.editForm().value()).subscribe({
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
        this.service.siteList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
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

    public tapRemove(item: ISite) {
        this.toastrService.confirm('确定删除“' + item.name + '”站点？', () => {
            this.service.siteRemove(item.id).subscribe(res => {
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
