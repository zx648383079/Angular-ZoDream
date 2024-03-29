import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INav } from '../../theme/components';
import { VisualMemberMenu } from '../../modules/visual/member/menu';
import { eachObject, isNumber } from '../../theme/utils';
import { BlogMemberMenu } from '../../modules/blog/member/menu';
import { ShortLinkMemberMenu } from '../../modules/short-link/member/menu';
import { NoteMemberMenu } from '../../modules/note/member/menu';
import { MicroMemberMenu } from '../../modules/micro/member/menu';
import { ForumMemberMenu } from '../../modules/forum/member/menu';
import { DocumentMemberMenu } from '../../modules/document/member/menu';
import { BotMemberMenu } from '../../modules/bot/member/menu';

interface MenuReadyMap {
    [path: string]: INav[];
}

interface INavCollection {
    tab: INav[];
    more: INav[];
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private readyMap: MenuReadyMap = {
        0: [
            {
                name: $localize `Overview`,
                icon: 'icon-home',
                url: 'home',
            },
            {
                name: $localize `Bulletin`,
                icon: 'icon-commenting',
                url: 'bulletin'
            },
        ],
        blog: BlogMemberMenu,
        visual: VisualMemberMenu,
        // doc: DocumentMemberMenu,
        // exam: ExamMemberMenu,
        forum: ForumMemberMenu,
        micro: MicroMemberMenu,
        note: NoteMemberMenu,
        short: ShortLinkMemberMenu,
        doc: DocumentMemberMenu,
        bot: BotMemberMenu,
        1: [
            {
                name: $localize `Thirdparty App`,
                icon: 'icon-rocket',
                url: 'authorize'
            },
            {
                name: $localize `Account Binding`,
                icon: 'icon-chain',
                url: 'connect'
            },
            {
                name: $localize `Login Drive`,
                icon: 'icon-mobile',
                url: 'driver'
            },
            {
                name: $localize `Setting`,
                icon: 'icon-cog',
                url: 'setting'
            }
        ],
    };

    public change$ = new BehaviorSubject<INavCollection>({tab: [], more: []});

    constructor() {}

    public refresh() {
        const data: INavCollection = {
            tab: [],
            more: []
        };
        const path = window.location.pathname.substring(15);
        let formatItems: INav[] = [];
        let activeItem: INav = undefined;
        eachObject(this.readyMap, (items, key) => {
            const currentBasePath = !isNumber(key) ? key as string : '';
            const formatSource = this.filterNav(items, currentBasePath);
            if (!formatSource || formatSource.length < 1) {
                return;
            }
            for (const item of formatSource) {
                if (item.url && item.url.length > 0 && path.indexOf(item.url) === 0) {
                    if (!activeItem || item.url.length > activeItem.url.length) {
                        activeItem = item;
                    }
                    item.active = true;
                    item.expand = !!item.children;
                }
                formatItems.push(item);   
            }
        });
        const tabCount = 2;
        formatItems.forEach((item, i) => {
            if (item.active && activeItem !== item) {
                item.active = false;
                item.expand = false;
            }
            if (i < tabCount || item.active) {
                data.tab.push(item);
                return;
            }
            data.more.push(item);
        });
        this.change$.next(data);
    }

    private renderUrl(path: string, base: string): string {
        path = this.combine(base, path);
        if (path.endsWith('./')) {
            return path;
        }
        if (path.endsWith('/')) {
            return path.substring(0, path.length - 1);
        }
        return path;
    }

    private combine(base: string, path: string): string {
        if (!path || !base) {
            return path;
        }
        if (path.startsWith('/')) {
            return path;
        }
        if (path.startsWith('./')) {
            return base + path.substring(1);
        }
        base = base !== '' && path.length > 0 ? base + '/' : base;
        return './' + base + (path.length > 0 && path.charAt(0) === '/' ? path.substring(1) : path);
    }

    private filterNav(items: INav[], base: string): INav[] {
        const data: INav[] = [];
        items.forEach(item => {
            const children = !item.children ? undefined : this.filterNav(item.children, base);
            const dist = {...item, children};
            dist.url = this.renderUrl(dist.url, base);
            data.push(dist);
        });
        return data;
    }
}
