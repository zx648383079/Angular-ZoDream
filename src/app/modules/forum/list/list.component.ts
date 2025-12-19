import { Component, OnInit, inject, signal } from '@angular/core';
import { IForum, IForumClassify, IThread } from '../model';
import { ForumService } from '../forum.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IErrorResult, IPageQueries } from '../../../theme/models/page';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { IUser } from '../../../theme/models/user';
import { ISortItem } from '../../../theme/models/seo';
import { ButtonEvent } from '../../../components/form';
import { SearchService, ThemeService } from '../../../theme/services';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    private readonly service = inject(ForumService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);


    public forum: IForum;
    public items: IThread[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
        classify: 0,
        type: 0,
    }));
    public readonly dataModel = signal({
        title: '',
        classify: '',
        content: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.title);
        required(schemaPath.content);
    });
    public user: IUser;
    public sortKey = 'updated_at';
    public orderAsc = false;

    public unreadCount = 0;
    public sortItems: ISortItem[] = [
        {name: $localize `Publish time`, value: 'created_at', asc: false},
        {name: $localize `Reply time`, value: 'updated_at', asc: false},
        {name: $localize `Reply count`, value: 'post_count', asc: false},
        {name: $localize `Better`, value: 'top_type', asc: false},
    ];

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
        });
        this.route.params.subscribe(params => {
            this.forum = {id: params.id} as any;
            this.service.getForum(params.id).subscribe(res => {
                this.forum = res;
                this.themeService.titleChanged.next(res.name);
                if (res.thread_top) {
                    res.thread_top = this.formatItems(res.thread_top);
                }
            });
            this.tapPage();
        });
    }

    public tapSort(item: ISortItem) {
        if (this.sortKey === item.value) {
            this.orderAsc = !this.orderAsc;
        } else {
            this.sortKey = item.value as string;
            this.orderAsc = !!item.asc;
        }
        this.tapRefresh();
    }

    public tapSearch(params: any) {
        this.queries().value.update(v => this.searchService.getQueries(params, v));
        this.tapRefresh();
    }

    public tapClassify(item?: IForumClassify) {
        this.queries.classify().value.set(item ? item.id : 0);
        this.tapRefresh();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `The content is not filled in completely`);
            return;
        }
        const data = {...this.dataForm().value(), forum: this.forum.id};
        e?.enter();
        this.service.threadSave(data).subscribe({
            next: res => {
                e?.reset();
                this.toastrService.success($localize `Published successfully`);
                this.dataModel.update(v => {
                    v.title = '';
                    v.content = '';
                    return v;
                });
                if (this.queries.page().value() < 2) {
                    this.tapRefresh();
                }
            },
            error: (err: IErrorResult) => {
                e?.reset();
                if (err.error.code === 401) {
                    this.themeService.emitLogin();
                    return;
                }
                this.toastrService.warning(err.error.message);
            }
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
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
        this.service.getThreadList({...queries, forum: this.forum.id, sort: this.sortKey, order: this.orderAsc ? 'asc' : 'desc'}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = this.formatItems(res.data);
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    private formatItems(items: IThread[]): IThread[] {
        return items.map(i => {
            if (i.classify && i.classify instanceof Array) {
                i.classify = undefined;
            }
            return i;
        });
    }

}
