import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../components/dialog';
import { SuggestChangeEvent } from '../../components/form';
import { AppState } from '../../theme/interfaces';
import { IPageQueries } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { SearchService } from '../../theme/services';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';
import { IWebPage } from './model';
import { NavigationService } from './navigation.service';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { NavigationPanelComponent } from './panel/navigation-panel.component';
import { selectSystemConfig } from '../../theme/reducers/system.selectors';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

    @ViewChild(ReportDialogComponent)
    private reportModal: ReportDialogComponent;
    @ViewChild(NavigationPanelComponent)
    private collectModal: NavigationPanelComponent;

    public openType = 0;
    public items: IWebPage[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        keywords: '',
        per_page: 20,
    };
    public user: IUser;

    constructor(
        private service: NavigationService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private themeService: ThemeService,
        private searchService: SearchService,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            this.user = user;
        });
        this.store.select(selectSystemConfig).subscribe(res => {
            if (res && res.today_wallpaper) {
                this.themeService.setBackground(res.today_wallpaper);
            }
        });
        this.themeService.setTitle('ZoDream Search');
        
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            if (!this.queries.keywords) {
                return;
            }
            this.tapPage();
        });
    }

    ngOnDestroy(): void {
        this.themeService.setBackground();
    }

    public tapItem(e: {type: number, data: IWebPage}) {
        if (e.type == 2) {
            this.reportModal.open(e.data);
            return;
        }
        if (e.type == 0) {
            this.collectModal.collect(e.data.title, e.data.link);
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

    public tapSearch(v: string) {
        this.queries.keywords = v.trim();
        if (this.queries.keywords.length > 0) {
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
        this.openType = 2;
        const queries = {...this.queries, page};
        this.service.search(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
            },
        });
    }

}
