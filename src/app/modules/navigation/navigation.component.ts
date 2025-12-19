import { form } from '@angular/forms/signals';
import { Component, OnDestroy, OnInit, inject, viewChild, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../components/dialog';
import { SuggestChangeEvent } from '../../components/form';
import { AppState } from '../../theme/interfaces';
import { IPageQueries } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { SearchService } from '../../theme/services';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';
import { IWebPage } from './model';
import { NavigationService } from './navigation.service';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { NavigationPanelComponent } from './panel/navigation-panel.component';
import { selectSystemConfig } from '../../theme/reducers/system.selectors';

@Component({
    standalone: false,
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
    private readonly service = inject(NavigationService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly themeService = inject(ThemeService);
    private readonly searchService = inject(SearchService);


    private readonly reportModal = viewChild(ReportDialogComponent);
    private readonly collectModal = viewChild(NavigationPanelComponent);

    public openType = 0;
    public items: IWebPage[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public readonly queries = form(signal<IPageQueries>({
        page: 1,
        keywords: '',
        per_page: 20,
    }));
    public user: IUser;

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
        this.store.select(selectSystemConfig).subscribe(res => {
            if (res && res.today_wallpaper && res.today_wallpaper.length > 0) {
                this.wallpager(res.today_wallpaper[0]);
            }
        });
        this.themeService.titleChanged.next('ZoDream Search');

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            if (!this.queries.keywords) {
                return;
            }
            this.tapPage();
        });
    }

    ngOnDestroy(): void {
        this.themeService.setBackground();
    }

    private wallpager(item: any) {
        if (window.outerWidth > window.outerHeight * .7) {
            this.themeService.setBackground(item.url);
        } else {
            this.themeService.setBackground(item.m_url);
        }
    }

    public tapItem(e: {type: number, data: IWebPage}) {
        if (e.type == 2) {
            this.reportModal().open(e.data);
            return;
        }
        if (e.type == 0) {
            this.collectModal().collect(e.data.title, e.data.link);
            return;
        }
    }

    public onSuggestChange(e: SuggestChangeEvent) {
        this.service.searchSuggest(e.text).subscribe(res => {
            e.suggest(res.data);
        });
    }

    public toggleOpen() {
        if (this.openType < 1) {
            this.openType = 1;
        } else if (this.openType === 1) {
            this.openType = 0;
        }
    }

    public tapSearch(val: string) {
        this.queries().value.update(v => {
            v.keywords = val.trim();
            v.page = 1;
            return v;
        });
        if (val.trim().length > 0) {
            this.tapRefresh();
            return;
        }
        this.openType = 0;
        this.searchService.applyHistory(this.queries);
    }

    public tapRefresh() {
        this.items = [];
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
        this.openType = 2;
        const queries = {...this.queries().value(), page};
        this.service.search(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(queries);
                this.queries().value.set(queries);
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
            },
        });
    }

}
