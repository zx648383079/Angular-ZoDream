import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IBlockItem } from '../../../components/link-rule';
import { IMessageBase } from '../../../components/message-container';
import { openLink } from '../../../theme/utils/deeplink';
import { DialogService } from '../../../components/dialog';
import { ThemeService } from '../../../theme/services';
import { NavigationDisplayMode } from '../../../theme/models/event';
import { parseNumber } from '../../../theme/utils';
import { ButtonEvent } from '../../../components/form';
import { emptyValidate } from '../../../theme/validators';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { IUser } from '../../../theme/models/user';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { form, required } from '@angular/forms/signals';

interface IMessageGroup {
    id?: number;
    icon?: string;
    avatar?: string;
    name: string;
    remark?: string;
}

@Component({
    standalone: false,
    selector: 'app-member-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(UserService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public navItems: IMessageGroup[] = [];
    public navIndex = -1;
    public items: IMessageBase[] = [];
    public hasMore = false;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public readonly dataForm = form(signal({
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });
    public authUser: IUser;
    public dropdownVisible = false;

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            this.authUser = user as any;
        });
    }

    ngOnInit() {
        this.themeService.titleChanged.next($localize `My Messages`);
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Compact);
        this.route.queryParams.subscribe(params => {
            const extra = parseNumber(params.user);
            this.service.bulletinUser(extra).subscribe(res => {
                this.navItems = res.data as any[];
                this.tapUser(extra);
            });
        });
    }

    ngOnDestroy(): void {
        this.themeService.navigationDisplayRequest.next(NavigationDisplayMode.Inline);
    }

    public readonly wordLength = computed(() => {
        return this.dataForm.content().value().length;
    })

    public get currentUser(): any {
        return this.navIndex >= 0 && this.navIndex < this.navItems.length ? this.navItems[this.navIndex] : {};
    }


    public openDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
    }

    public tapBack() {
        if (this.navIndex >= 0) {
            this.navIndex = -1;
            return;
        }
        history.back();
    }

    public tapUser(user: number) {
        for (let i = 0; i < this.navItems.length; i++) {
            if (this.navItems[i].id === user) {
                this.tapNav(i);
                return;
            }
        }
        if (this.themeService.tabletChanged.value) {
            return;
        }
        return this.tapNav(0);
    }

    public tapNav(i: number) {
        this.navIndex = i;
        this.dataForm.content().value.set('');
        this.tapRefresh();
    }

    public onMessageTap(item: IBlockItem) {
        if (item.type == 4) {
            openLink(this.router, item.link);
        }
    }

    public tapSend(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Please input the content`);
            return;
        }
        if (!this.currentUser || this.currentUser.id <= 0) {
            return;
        }
        e?.enter();
        const data = this.dataForm().value();
        this.service.bulletinSend({
            user: this.currentUser.id,
            ...data
        }).subscribe({
            next: _ => {
                e?.reset();
                this.items.push({
                    content: data.content,
                    user: this.authUser,
                    type: 0,
                    created_at: new Date()
                });
                this.dataForm.content().value.set('');
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        })
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore(lastId: number) {
        if (lastId < 1) {
            return;
        }
        const item = this.navIndex >= 0 ? this.navItems[this.navIndex] : null;
        this.service.bulletinList({
            user: item && item.id > 0 ? item.id : -1,
            last_id: lastId,
            page: 1,
            per_page: this.perPage
        }).subscribe(res => {
            const items = res.data.map(i => {
                return {
                    id: i.id,
                    user: i.bulletin.user,
                    content: i.bulletin.title + '\n' + i.bulletin.content,
                    extra_rule: i.bulletin.extra_rule,
                    type: 0,
                    created_at: i.created_at,
                };
            });
            this.items = [].concat(items, this.items);
            this.hasMore = res.paging.more;
        });
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const item = this.navIndex >= 0 ? this.navItems[this.navIndex] : null;
        this.service.bulletinList({
            user: item && item.id > 0 ? item.id : -1,
            page,
            per_page: this.perPage
        }).subscribe({
            next: res => {
                this.isLoading = false;
                const items = res.data.map(i => {
                    return {
                        id: i.id,
                        user: i.bulletin.user,
                        content: i.bulletin.title + '\n' + i.bulletin.content,
                        extra_rule: i.bulletin.extra_rule,
                        type: 0,
                        created_at: i.created_at,
                    };
                });
                this.items = items;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }


}
