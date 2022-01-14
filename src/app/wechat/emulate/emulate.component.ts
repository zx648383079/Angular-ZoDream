import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../dialog';
import { MessageContainerComponent } from '../../message-container/message-container.component';
import { IMessageBase } from '../../message-container/model';
import { AppState } from '../../theme/interfaces';
import { IUser } from '../../theme/models/user';
import { getCurrentUser } from '../../theme/reducers/auth.selectors';
import { ThemeService } from '../../theme/services';
import { emptyValidate } from '../../theme/validators';
import { IWeChatAccount, IWeChatMenuItem } from '../model';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-emulate',
  templateUrl: './emulate.component.html',
  styleUrls: ['./emulate.component.scss']
})
export class EmulateComponent implements OnInit {

    @ViewChild(MessageContainerComponent)
    public messageBody: MessageContainerComponent;

    public account: IWeChatAccount;
    public menuItems: IWeChatMenuItem[] = [];
    public messageItems: IMessageBase[] = [];
    public footerIndex = 1;
    public content = '';
    public user: IUser = {
        id: -1,
        name: '[游客]',
        avatar: '/assets/images/favicon.png',
    };

    constructor(
        private service: WechatService,
        private route: ActivatedRoute,
        private themeService: ThemeService,
        private toastrService: DialogService,
        private store: Store<AppState>,
    ) {
        this.store.select(getCurrentUser).subscribe(user => {
            if (user) {
                this.user = user;
            }
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.get(params.id).subscribe((res: any) => {
                this.account = res;
                this.themeService.setTitle(res.name);
                if (res.menu_list && res.menu_list.length > 0) {
                    this.menuItems = res.menu_list;
                    this.footerIndex = 0;
                }
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public toggleMore() {
        this.footerIndex = this.footerIndex == 2 ? 1 : 2;
    }

    public onKeydown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSend();
    }

    public tapMenu(item: IWeChatMenuItem) {
        if (item.type == 99) {
            item.open = !item.open;
            return;
        }
        this.messageBody.append([this.formatByUser({
            type: 99,
            content: `你点击了“${item.name}”菜单`,
        })]);
        if (item.type == 5) {
            window.open(item.content, '_blank');
            return;
        }
        if (item.type == 6) {
            window.open(JSON.parse(item.content).url, '_blank');
            return;
        }
        this.service.reply({
            id: this.account.id,
            content: item.id,
            type: 'menu',
        }).subscribe({
            next: res => {
                this.appendResp(res);
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapSend() {
        if (emptyValidate(this.content)) {
            this.toastrService.warning($localize `Please inpu the content`);
            return;
        }
        this.service.reply({
            id: this.account.id,
            content: this.content,
        }).subscribe({
            next: res => {
                this.messageBody.append([this.formatByUser({type: 0, content: this.content})]);
                this.appendResp(res);
                this.content = '';
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapMessageMore(lastId: number) {
        if (lastId < 1) {
            return;
        }
    }

    private appendResp(res: any) {
        const items = res.data instanceof Array ? res.data : [res.data];
        this.messageBody.append(items.map(i => {
            if (i.type === 'text') {
                return this.formatByAccount({
                    type: 0,
                    content: i.content,
                });
            }
            if (i.type === 'news') {
                return this.formatByAccount({
                    type: 80,
                    items: i.items,
                });
            }
            return this.formatByAccount(i);
        }));
    }

    private formatByUser(data: any) {
        return {...data, created_at: new Date(), user: this.user};
    }

    private formatByAccount(data: any) {
        return {...data, created_at: new Date(), user: {
            id: 'wx',
            name: this.account.name,
            avatar: this.account.avatar
        }};
    }
}
