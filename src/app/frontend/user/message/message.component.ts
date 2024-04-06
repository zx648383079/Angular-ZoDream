import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IBlockItem } from '../../../components/link-rule';
import { IMessageBase } from '../../../components/message-container';
import { openLink } from '../../../theme/utils/deeplink';
import { DialogService } from '../../../components/dialog';
import { SearchService, ThemeService } from '../../../theme/services';
import { NavToggle, SearchEvents } from '../../../theme/models/event';
import { parseNumber } from '../../../theme/utils';
import { ButtonEvent } from '../../../components/form';
import { emptyValidate } from '../../../theme/validators';
import { AppState } from '../../../theme/interfaces';
import { Store } from '@ngrx/store';
import { IUser } from '../../../theme/models/user';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';

interface IMessageGroup {
    id?: number;
    icon?: string;
    avatar?: string;
    name: string;
    remark?: string;
}

@Component({
    selector: 'app-member-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {

    public navItems: IMessageGroup[] = [];
    public navIndex = -1;
    public items: IMessageBase[] = [];
    public hasMore = false;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public content = '';
    public authUser: IUser;

    constructor(
        private store: Store<AppState>,
        private service: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {
        this.store.select(selectAuthUser).subscribe(user => {
            this.authUser = user as any;
        });
    }

    ngOnInit() {
        this.themeService.setTitle($localize `My Messages`);
        this.searchService.emit(SearchEvents.NAV_TOGGLE, NavToggle.Flow);
        this.route.queryParams.subscribe(params => {
            const extra = parseNumber(params.user);
            this.service.bulletinUser(extra).subscribe(res => {
                this.navItems = res.data as any[];
                this.tapUser(extra);
            });
        });
    }

    ngOnDestroy(): void {
        this.searchService.emit(SearchEvents.NAV_TOGGLE, NavToggle.Unreal);
    }

    public get wordLength() {
        return this.content.length;
    }

    public get currentUser(): any {
        return this.navIndex >= 0 && this.navIndex < this.navItems.length ? this.navItems[this.navIndex] : {};
    }

    public tapUser(user: number) {
        for (let i = 0; i < this.navItems.length; i++) {
            if (this.navItems[i].id === user) {
                this.tapNav(i);
                return;
            }
        }
        return this.tapNav(0);
    }

    public tapNav(i: number) {
        this.navIndex = i;
        this.content = '';
        this.tapRefresh();
    }

    public onMessageTap(item: IBlockItem) {
        if (item.type == 4) {
            openLink(this.router, item.link);
        }
    }

    public tapSend(e?: ButtonEvent) {
        if (emptyValidate(this.content)) {
            this.toastrService.warning($localize `Please input the content`);
            return;
        }
        if (!this.currentUser || this.currentUser.id <= 0) {
            return;
        }
        e?.enter();
        this.service.bulletinSend({
            user: this.currentUser.id,
            content: this.content
        }).subscribe({
            next: _ => {
                e?.reset();
                this.items.push({
                    content: this.content,
                    user: this.authUser,
                    type: 0,
                    created_at: new Date()
                });
                this.content = '';
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
