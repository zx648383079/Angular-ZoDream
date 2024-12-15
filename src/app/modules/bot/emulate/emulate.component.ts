import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../components/dialog';
import { MessageContainerComponent, IMessageBase } from '../../../components/message-container';
import { AppState } from '../../../theme/interfaces';
import { IUser } from '../../../theme/models/user';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { ThemeService } from '../../../theme/services';
import { emptyValidate } from '../../../theme/validators';
import { BotService } from '../bot.service';
import { IBotAccount, IBotMenuItem } from '../model';

@Component({
    standalone: false,
  selector: 'app-bot-emulate',
  templateUrl: './emulate.component.html',
  styleUrls: ['./emulate.component.scss']
})
export class EmulateComponent implements OnInit {

    @ViewChild(MessageContainerComponent)
    public messageBody: MessageContainerComponent;

    public account: IBotAccount;
    public menuItems: IBotMenuItem[] = [];
    public messageItems: IMessageBase[] = [];
    public footerIndex = 1;
    public content = '';
    public user: IUser = {
        id: -1,
        name: $localize `[Guest]`,
        avatar: '/assets/images/favicon.png',
    };

    constructor(
        private service: BotService,
        private route: ActivatedRoute,
        private themeService: ThemeService,
        private toastrService: DialogService,
        private store: Store<AppState>,
    ) {
        this.store.select(selectAuthUser).subscribe(user => {
            if (user) {
                this.user = user;
            }
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.load(params.id);
        });
    }

    public tapBack() {
        history.back();
    }

    private load(id: any) {
        this.service.get(id).subscribe({
            next: (res: any) => {
                this.account = res;
                this.themeService.setTitle(res.name);
                if (res.menu_list && res.menu_list.length > 0) {
                    this.menuItems = res.menu_list;
                    this.footerIndex = 0;
                }
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
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

    public tapMenu(item: IBotMenuItem) {
        if (item.type == 99) {
            item.open = !item.open;
            return;
        }
        this.messageBody.append([this.formatByUser({
            type: 99,
            content: $localize `You tap "${item.name}" menu`,
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

    public onBlockTap(data: any) {
        if (data.type == 80) {
            window.open(data.url, '_blank');
            return;
        }
        if (data.type == 4) {
            window.open(data.link, '_blank');
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
            if (i.type === 'url') {
                return this.formatByAccount({
                    type: 0,
                    content: i.content,
                    extra_rule: [
                        {s: i.content, l: i.content}
                    ]
                });
            }
            if (i.type === 'template') {
                return this.formatByAccount({
                    type: 0,
                    content: `${i.content}\n\n查看详情`,
                    extra_rule: [
                        {s: '查看详情', l: i.url}
                    ]
                });
            }
            if (i.type === 'image' || i.type === 'thumb') {
                return this.formatByAccount({
                    type: 1,
                    content: i.content,
                });
            }
            if (i.type === 'video') {
                return this.formatByAccount({
                    type: 2,
                    content: i.content,
                });
            }
            if (i.type === 'voice') {
                return this.formatByAccount({
                    type: 3,
                    content: i.content,
                });
            }
            if (i.type === 'news') {
                return this.formatByAccount({
                    type: 80,
                    items: i.items.map(it => {
                        it.url = `/wx/emulate/${this.account.id}/${it.id}`;
                        return it;
                    }),
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
            id: '_bot',
            name: this.account.name,
            avatar: this.account.avatar
        }};
    }
}
