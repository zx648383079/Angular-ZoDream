import { disabled, form, required } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import { IPageQueries } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../../theme/validators';
import { AppStoreService } from '../../app-store.service';
import { IComment } from '../../model';

@Component({
    standalone: false,
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
    service = inject(AppStoreService);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly toastrService = inject(DialogService);

    public readonly itemId = input(0);
    public readonly init = input(false);
    public readonly items = signal<IComment[]>([]);
    public subtotal: any;
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        page: 1,
        per_page: 20,
        sort: 'created_at',
        order: 'desc',
    }));
    private booted = 0;
    public readonly commentForm = form(signal({
        parent_id: 0,
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
        disabled(schemaPath, () => !this.user);
    });
    public user: IUser;

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
        effect(() => {
            if (this.init() && this.itemId() > 0 && this.booted !== this.itemId()) {
                this.boot();
            }
        });
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapComment(e?: ButtonEvent) {
        if (!this.user) {
            this.toastrService.warning($localize `Please login in first`);
            return;
        }
        if (this.commentForm().invalid()) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        e?.enter();
        this.service.commentSave({...this.commentForm().value(), resource: this.itemId()}).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Comment successful`);
                this.commentForm().value.update(v => {
                    v.content = '';
                    v.parent_id = 0;
                    return v;
                });
            },
            error: err => {
                e?.reset();
                this.toastrService.warning(err);
            }
        })
    }


    public tapSort(sort: string) {
        this.queries.order().value.set(sort);
        this.tapRefresh();
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
        this.service.commentList({...queries, software: this.itemId()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
