import { Component, OnInit, inject } from '@angular/core';
import { INavLink } from '../../../theme/models/seo';
import { ActivatedRoute, Router } from '@angular/router';
import { BotService } from './bot.service';
import { ThemeService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-bot-member',
    templateUrl: './bot-member.component.html',
    styleUrls: ['./bot-member.component.scss']
})
export class BotMemberComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private service = inject(BotService);
    private themeService = inject(ThemeService);


    public items: INavLink[] = [
        {
            name: '账号列表',
            label: '账',
            url: '../',
        },
        {
            name: '消息列表',
            label: '消',
            url: 'reply',
        },
        {
            name: '素材列表',
            label: '素',
            url: 'media',
        },
        {
            name: '菜单列表',
            label: '菜',
            url: 'menu',
        },
        {
            name: '二维码列表',
            label: '码',
            url: 'qrcode',
        },
        {
            name: '发送消息',
            label: '发',
            url: 'send',
        },
        {
            name: '用户列表',
            label: '用',
            url: 'user',
        },
        {
            name: '记录列表',
            label: '记',
            url: 'log',
        },
    ];

    ngOnInit(): void {
        this.themeService.titleChanged.next($localize `Bot Manage`);
        this.route.params.subscribe(res => {
            this.service.baseId = res.wid;
        });
    }

    public tapNav(item: INavLink) {
        for (const it of this.items) {
            it.active = item == it;
        }
        this.router.navigate([item.url], {relativeTo: this.route});
    }
}
