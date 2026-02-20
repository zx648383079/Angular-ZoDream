import { form, required } from '@angular/forms/signals';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../components/dialog';
import { ButtonEvent } from '../../components/form';
import { AppState } from '../../theme/interfaces';
import { IPageQueries } from '../../theme/models/page';
import { IUser } from '../../theme/models/user';
import { selectAuthUser } from '../../theme/reducers/auth.selectors';
import { SearchService, ThemeService } from '../../theme/services';
import { wordLength } from '../../theme/utils';
import { INote } from './model';
import { NoteService } from './note.service';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    standalone: false,
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss']
})
export class NoteComponent {
    private readonly service = inject(NoteService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly searchService = inject(SearchService);
    private readonly themeService = inject(ThemeService);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly destroyRef = inject(DestroyRef);


    public readonly items = signal<INote[]>([]);
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
        user: 0,
    }))

    public readonly editForm = form(signal({
        content: '',
        status: 1,
    }), schemaPath => {
        required(schemaPath.content);
    });
    public readonly authUser = signal<IUser>(null);

    public readonly size = computed(() => wordLength(this.editForm.content().value()));
    constructor() {
        this.themeService.titleChanged.next($localize `Note`);
        this.store.select(selectAuthUser).subscribe(user => {
            this.authUser.set(user);
        });
        this.themeService.suggestQuerySubmitted.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
            this.queries.keywords().value.set(res);
            this.tapRefresh();
        });
        this.route.queryParams.subscribe(params => {
            this.queries().value.update(v => this.searchService.getQueries(params, v));
            this.tapPage();
        });
    }

    public toggleVisible() {
        this.editForm.status().value.update(v => v > 0 ? 0 : 1);
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.size() === 0) {
            this.toastrService.warning($localize `Please input the content`);
            return;
        }
        e?.enter();
        this.service.save({
            ...this.editForm().value()
        }).subscribe({
            next: _ => {
                e?.reset();
                this.editForm.content().value.set('');
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
                    this.items.update(v => {
                        return v.filter(it => {
                            return it.id !== item.id;
                        });
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
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.getList(queries).subscribe({
            next: res => {
                const data = res.data.map(i => {
                    i.html = this.sanitizer.bypassSecurityTrustHtml(i.html);
                    return i;
                })
                this.hasMore.set(res.paging.more);
                this.isLoading.set(false);
                this.items.update(v => {
                    if (page < 2) {
                        return data;
                    }
                    return [...v, ...data];
                });
                this.queries().value.set(queries);
                this.searchService.applyHistory(queries, false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }
}
