import { Component, OnInit, inject, signal } from '@angular/core';
import { IMessageBase } from '../../../../components/message-container';
import { IBlockItem } from '../../../../components/link-rule';
import { GameCommand, GameRouterInjectorToken, IGameRouter, IGameScene } from '../../model';

@Component({
    standalone: false,
    selector: 'app-game-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements IGameScene, OnInit {
    private readonly router = inject<IGameRouter>(GameRouterInjectorToken);


    public readonly items = signal<IMessageBase[]>([]);
    public readonly hasMore = signal(false);
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public detailMode = false;
    public canReply = false;
    
    ngOnInit(): void {
        this.router.request(GameCommand.MessageOwn).subscribe(res => {
            // this.items.set(res.data);
        });
    }

    public tapBack() {
        this.router.navigateBack();
    }

    public onMessageTap(item: IBlockItem) {
        if (item.type == 4) {
            // openLink(this.router, item.link);
        }
    }


    public tapMore(lastId: number) {
        if (lastId < 1) {
            return;
        }
        // const item = this.navIndex >= 0 ? this.navItems[this.navIndex] : null;
        // this.service.bulletinList({
        //     user: item && item.id > 0 ? item.id : -1,
        //     last_id: lastId,
        //     page: 1,
        //     per_page: this.perPage
        // }).subscribe(res => {
        //     const items = res.data.map(i => {
        //         return {
        //             id: i.id,
        //             user: i.bulletin.user,
        //             content: i.bulletin.title + '\n' + i.bulletin.content,
        //             extra_rule: i.bulletin.extra_rule,
        //             type: 0,
        //             created_at: i.created_at,
        //         };
        //     });
        //     this.items.set([].concat(items, this.items));
        //     this.hasMore = res.paging.more;
        // });
    }

}
