import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INavLink } from '../../theme/models/seo';
import { VisualMemberMenu } from '../../modules/visual/member/menu';
import { eachObject, isNumber } from '../../theme/utils';
import { BlogMemberMenu } from '../../modules/blog/member/menu';
import { ShortLinkMemberMenu } from '../../modules/short-link/member/menu';
import { NoteMemberMenu } from '../../modules/note/member/menu';
import { MicroMemberMenu } from '../../modules/micro/member/menu';
import { ForumMemberMenu } from '../../modules/forum/member/menu';
import { DocumentMemberMenu } from '../../modules/document/member/menu';
import { BotMemberMenu } from '../../modules/bot/member/menu';
import { MemberMenu } from '../../modules/auth/member/menu';
import { TrackerMemberMenu } from '../../modules/trade-tracker/member/menu';

interface MenuReadyMap {
    [path: string]: INavLink[];
}

interface INavCollection {
    tab: INavLink[];
    more: INavLink[];
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
            {
                name: $localize `My Messages`,
                icon: 'icon-comments',
                url: 'message'
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
        tracker: TrackerMemberMenu,
        account: MemberMenu
    };

    public change$ = new BehaviorSubject<INavCollection>({tab: [], more: []});

    public refresh() {
        const data: INavCollection = {
            tab: [],
            more: []
        };
        const path = window.location.pathname.substring(15);
        let formatItems: INavLink[] = [];
        let activeItem: INavLink = undefined;
        eachObject(this.readyMap, (items, key: string) => {
            const currentBasePath = this.formatRoutePath(key);
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

    /**
     * 获取 module 路由
     * @param key 
     * @returns 
     */
    private formatRoutePath(key: string): string {
        return !isNumber(key) && !key.startsWith('_') ? key : '';
    }

    private formatUrl(path: string, base: string): string {
        path = this.combineUrl(base, path);
        if (path.endsWith('./')) {
            return path;
        }
        if (path.endsWith('/') && path.length > 1) {
            return path.substring(0, path.length - 1);
        }
        return path;
    }

    private combineUrl(base: string, path: string): string {
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
        return /*'./' +*/ base + (path.length > 0 && path.charAt(0) === '/' ? path.substring(1) : path);
    }

    /**
     * 添加模块路由
     * @param items 
     * @param base 
     * @returns 
     */
    private filterNav(items: INavLink[], base: string): INavLink[] {
        const data: INavLink[] = [];
        items.forEach(item => {
            const children = !item.children ? undefined : this.filterNav(item.children, base);
            const dist = {...item, children};
            dist.url = this.formatUrl(dist.url, base);
            data.push(dist);
        });
        return data;
    }
}
