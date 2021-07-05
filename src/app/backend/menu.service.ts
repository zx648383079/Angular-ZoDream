import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BlogBackendMenu } from '../blog/backend/menu';
import { BookBackendMenu } from '../book/backend/menu';
import { CheckInBackendMenu } from '../checkin/backend/menu';
import { CMSBackendMenu } from '../cms/backend/menu';
import { DocumentBackendMenu } from '../document/backend/menu';
import { ExamBackendMenu } from '../exam/backend/menu';
import { ForumBackendMenu } from '../forum/backend/menu';
import { LegworkBackendMenu } from '../legwork/backend/menu';
import { MicroBackendMenu } from '../micro/backend/menu';
import { OnlineServiceBackendMenu } from '../online-service/backend/menu';
import { ShopBackendMenu } from '../shop/backend/menu';
import { INav } from '../theme/components';
import { IUser } from '../theme/models/user';
import { eachObject } from '../theme/utils';
import { VideoBackendMenu } from '../video/backend/menu';
import { WechatBackendMenu } from '../wechat/backend/menu';
import { AuthBackendMenu, backendBottomMenu, backendMenuItems, SmsBackendMenu } from './menu';
import { OpenBackendMenu } from './open/menu';
import { SystemtBackendMenu } from './system/menu';

interface INavCollection {
    items: INav[];
    bottom: INav[];
}

interface IMenuReadyCollection {
    items: MenuReadyItem;
    bottom: MenuReadyItem;
}

interface MenuReadyMap {
    [path: string]: MenuReadyFn|INav[];
}

type MenuReadyItem = MenuReadyMap|INav[][];
export type MenuReadyFn = (this: MenuService, basePath: string, value: any, option: any) => INav[];

const USER_OPTION_KEY = '_user';
const ROLE_OPTION_KEY = '_roles';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    public readyMap: IMenuReadyCollection = {
        items: {
            0: backendMenuItems,
            auth: AuthBackendMenu,
            blog: BlogBackendMenu,
            micro: MicroBackendMenu,
            shop: ShopBackendMenu,
            forum: ForumBackendMenu,
            book: BookBackendMenu,
            video: VideoBackendMenu,
            legwork: LegworkBackendMenu,
            os: OnlineServiceBackendMenu,
            doc: DocumentBackendMenu,
            exam: ExamBackendMenu,
            cms: CMSBackendMenu,
            wx: WechatBackendMenu,
            open: OpenBackendMenu,
            sms: SmsBackendMenu,
            checkin: CheckInBackendMenu,
            system: SystemtBackendMenu,
        },
        bottom: [
            backendBottomMenu
        ]
    };

    public change$ = new BehaviorSubject<INavCollection>({items: [], bottom: []});

    private option: any = {};

    private currentBasePath: string = '';
    private refreshHandle = 0;

    constructor() {}

    public setUser(user?: IUser) {
        this.put(USER_OPTION_KEY, user);
        this.asyncRefresh();
    }

    public setRole(items: string[]) {
        this.put(ROLE_OPTION_KEY, items);
        this.asyncRefresh();
    }

    public put(key: string, value: any) {
        this.option[key] = value;
        this.asyncRefresh();
    }

    public get<T extends any>(key: string, def?: T): T|undefined {
        return Object.prototype.hasOwnProperty.call(this.option, key) ? this.option[key] : def;
    }

    public asyncRefresh(time = 200) {
        if (this.refreshHandle > 0) {
            clearTimeout(this.refreshHandle);
        }
        this.refreshHandle = window.setTimeout(() => {
            this.refreshHandle = 0;
            this.refresh();
        }, time);
    }

    public refresh() {
        const data: INavCollection = {
            items: [],
            bottom: [],
        };
        const roles = this.get<string[]>(ROLE_OPTION_KEY, []);
        const path = window.location.pathname.substr(9);
        eachObject(this.readyMap, (items, k) => {
            let formatItems = [];
            eachObject(items, (source: MenuReadyItem, key) => {
                this.currentBasePath = typeof key === 'string' ? key : '';
                const formatSource = this.filterNavByRole(typeof source === 'function' ? (source as MenuReadyFn).call(this, this.currentBasePath, this.get(this.currentBasePath), this.option) : source, roles);
                if (!formatSource && formatSource.length > 0) {
                    return;
                }
                if (this.currentBasePath.length > 0 && path.indexOf(this.currentBasePath) === 0) {
                    formatSource[0].expand = !!formatSource[0].children;
                    formatSource[0].active = true;
                }
                formatItems = [].concat(formatItems, formatSource);
            });
            data[k] = formatItems;
        });
        const user = this.get<IUser>(USER_OPTION_KEY);
        if (user && data.bottom.length > 0) {
            data.bottom[0].name = user.name;
        }
        this.change$.next(data);
    }

    public renderUrl(path: string): string {
        const base = this.currentBasePath !== '' && path.length > 0 ? this.currentBasePath + '/' : this.currentBasePath;
        return './' + base + (path.length > 0 && path.charAt(0) === '/' ? path.substr(1) : path);
    }

    public filterNavByRole(items: INav[], roles: string[], parentRole?: string): INav[] {
        const data: INav[] = [];
        items.forEach(item => {
            const children = !item.children ? undefined : this.filterNavByRole(item.children, roles, item.role);
            const current = item.role || parentRole;
            if (!current || roles.indexOf(current) >= 0) {
                data.push({...item, children});
                return;
            }
            if (children && children.length > 0) {
                data.push({...item, children, url: undefined});
            }
        });
        return data;
    }
}
