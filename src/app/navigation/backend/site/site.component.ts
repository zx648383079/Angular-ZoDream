import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DialogEvent, DialogService } from '../../../dialog';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { emptyValidate } from '../../../theme/validators';
import { ISite, ISiteCategory, ISiteTag } from '../../model';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

    public items: ISite[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        category: 0,
        user: 0,
        tag: 0,
    };
    public categories: ISiteCategory[] = [];
    public tagItems$: Observable<ISiteTag[]>;
    public tagInput$ = new Subject<string>();
    public tagLoading = false;
    public topItems = ['无', '推荐'];
    public editData: ISite = {} as any;

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
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

    public open(modal: DialogEvent, item?: ISite) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
            logo: '',
            description: '',
            cat_id: 0,
            schema: 'https',
            domain: '',
            top_type: 0,
            tags: [],
        };
        modal.open(() => {
            this.service.siteSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success('保存成功');
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
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
        this.service.siteList(queries).subscribe({
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

    public tapRemove(item: ISite) {
        this.toastrService.confirm('确定删除“' + item.name + '”站点？', () => {
            this.service.siteRemove(item.id).subscribe(res => {
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
