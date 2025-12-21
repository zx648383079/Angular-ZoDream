import { form } from '@angular/forms/signals';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { AppState } from '../../../../theme/interfaces';
import {
    IComment
} from '../../model';
import { IPageQueries } from '../../../../theme/models/page';
import { IUser } from '../../../../theme/models/user';
import { selectAuthUser } from '../../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../../theme/validators';
import { BlogService } from '../blog.service';
import { ThemeService } from '../../../../theme/services';
import { eachObject } from '../../../../theme/utils';

const GuestUserKey = 'gu';

@Component({
    standalone: false,
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
    private readonly service = inject(BlogService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);
    private readonly store = inject<Store<AppState>>(Store);


    public readonly itemId = input(0);
    public readonly init = input(false);
    public readonly status = input(0);

    public hotItems: IComment[] = [];
    public readonly items = signal<IComment[]>([]);
    public readonly hasMore = signal(true);
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
    public user: IUser;

    public readonly commentForm = form(signal({
        content: '',
        parent_id: 0,
    }));
    public readonly guestForm = form(signal({
        name: '',
        email: '',
        url: '',
    }));


    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.user = user;
        });
        this.loadGuestUser();
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
        this.service.commentList({
            blog_id: this.itemId(),
            is_hot: true,
            per_page: 5,
        }).subscribe(res => {
            this.hotItems = res.data;
        });
        this.tapRefresh();
    }

    public tapLogin() {
        this.themeService.emitLogin(true);
    }

    public onEmailChange() {
        const data = this.guestForm().value();
        if (emptyValidate(data.email) || !emptyValidate(data.url)) {
            return;
        }
        this.service.commentator(data.email).subscribe(res => {
            this.guestForm().value.update(v => {
                v.name = res.name;
                v.url = res.url;
                return v;
            });
        });
    }

    public onReply(data: any) {
        if (this.status() === 2 && !this.user) {
            this.tapLogin();
            data.error();
            return;
        }
        if (emptyValidate(data.content)) {
            this.toastrService.warning($localize `Please input content`);
            data.error();
            return;
        }
        if (!this.user) {
            this.guestForm().value.update(v => {
                eachObject(v, (_, k) => {
                    v[k] = data[k];
                });
                return v;
            });
        }
        const commentData = {...data, blog_id: this.itemId()};
        delete commentData['next'], commentData['error'];
        this.service.commentSave(commentData).subscribe({
            next: _ => {
                this.toastrService.success($localize `Comment successful`);
                this.saveGuestUser();
                data.next();
            },
            error: err => {
                this.toastrService.warning(err);
                data.error();
            }
        });
    }

    public tapComment(e?: ButtonEvent) {
        if (this.status() === 2 && !this.user) {
            this.tapLogin();
            return;
        }
        if (emptyValidate(this.commentForm.content().value())) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        const data = Object.assign({blog_id: this.itemId()}, this.commentForm().value());
        if (!this.user) {
            eachObject(this.guestForm().value(), (v, k) => {
                data[k] = v;
            });
        }
        e?.enter();
        this.service.commentSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Comment successful`);
                this.commentForm().value.update(v => {
                    v.content = '';
                    v.parent_id = 0;
                    return v;
                });
                this.saveGuestUser();
            },
            error: err => {
                e?.reset();
                this.toastrService.warning(err);
            }
        });
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
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.commentList({...queries, blog_id: this.itemId()}).subscribe({
            next: res => {
                this.hasMore.set(res.paging.more);
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

    private loadGuestUser() {
        const str = window.localStorage.getItem(GuestUserKey);
        if (!str) {
            return;
        }
        const data = JSON.parse(str);
        this.guestForm().value.update(v => {
            eachObject(v, (_, k) => {
                v[k] = data[k];
            });
            return v;
        });
    }

    private saveGuestUser() {
        if (emptyValidate(this.guestForm.name().value())) {
            return;
        }
        window.localStorage.setItem(GuestUserKey, JSON.stringify(this.guestForm().value()));
    }
}
