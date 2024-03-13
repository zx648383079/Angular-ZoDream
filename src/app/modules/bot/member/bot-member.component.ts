import { Component, OnInit } from '@angular/core';
import { INav } from '../../../theme/components';
import { ActivatedRoute, Router } from '@angular/router';
import { BotService } from './bot.service';
import { ThemeService } from '../../../theme/services';

@Component({
  selector: 'app-bot-member',
  templateUrl: './bot-member.component.html',
  styleUrls: ['./bot-member.component.scss']
})
export class BotMemberComponent implements OnInit {

    public items: INav[] = [
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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private service: BotService,
        private themeService: ThemeService
    ) { 
    }

    ngOnInit(): void {
        this.themeService.setTitle($localize `Bot Manage`);
        this.route.params.subscribe(res => {
            this.service.baseId = res.wid;
        });
    }

    public tapNav(item: INav) {
        for (const it of this.items) {
            it.active = item == it;
        }
        this.router.navigate([item.url], {relativeTo: this.route});
    }
}
