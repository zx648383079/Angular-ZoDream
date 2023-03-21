import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INav } from '../../theme/components';
import { VisualMemberMenu } from '../../modules/visual/member/menu';
import { eachObject, isNumber } from '../../theme/utils';
import { BlogMemberMenu } from '../../modules/blog/member/menu';

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
                name: 'Overview',
                url: 'home',
            },
            {
                name: 'Bulletin',
                url: 'bulletin'
            },
        ],
        blog: BlogMemberMenu,
        visual: VisualMemberMenu,
        1: [
            {
                name: '第三方应用',
                url: 'authorize'
            },
            {
                name: '关联账号',
                url: 'connect'
            },
            {
                name: '登录设备',
                url: 'driver'
            },
            {
                name: 'Setting',
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
