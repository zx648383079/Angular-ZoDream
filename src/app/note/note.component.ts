import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../dialog';
import { ButtonEvent } from '../form';
import { AppState } from '../theme/interfaces';
import { IPageQueries } from '../theme/models/page';
import { IUser } from '../theme/models/user';
import { applyHistory, getQueries } from '../theme/query';
import { getCurrentUser } from '../theme/reducers/auth.selectors';
import { SearchService, ThemeService } from '../theme/services';
import { wordLength } from '../theme/utils';
import { INote } from './model';
import { NoteService } from './note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy {

    public items: INote[] = [];
    public hasMore = true;
    public isLoading = false;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        user: 0,
    }

    public editData: any = {
        content: ''
    };
    public authUser: IUser;

    constructor(
        private service: NoteService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Note`);
        this.store.select(getCurrentUser).subscribe(user => {
            this.authUser = user;
        });
    }

    public get size() {
        return wordLength(this.editData.content);
    }

    ngOnInit() {
        this.searchService.on('confirm', res => {
            this.queries.keywords = res;
            this.tapRefresh();
        });
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    ngOnDestroy() {
        this.searchService.offReceiver();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.size === 0) {
            this.toastrService.warning($localize `Please input the content`);
            return;
        }
        e?.enter();
        this.service.save({
            content: this.editData.content,   
        }).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Successfully released!`);
                this.tapRefresh();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        })
    }

    public tapRemove(item: INote) {
        this.toastrService.confirm($localize `Are you sure you want to delete this note? `, () => {
            this.service.remove(item.id).subscribe({
                next: res => {
                    if (!res.data) {
                        return;
                    }
                    this.toastrService.success($localize `successfully deleted! `);
                    this.items = this.items.filter(it => {
                        return it.id !== item.id;
                    });
                }, 
                error: err => {
                    this.toastrService.warning(err);
                }
            });
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const params: any = {...this.queries, page};
        this.service.getList(params).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.items = page < 2 ? res.data : [].concat(this.items, res.data);
                applyHistory(this.queries = params, false);
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
