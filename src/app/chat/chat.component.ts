import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    ChatService
} from './chat.service';
import {
    IMessage,
    IFriend,
    IFriendGroup
} from '../theme/models/chat';
import { COMMAND_FRIENDS, COMMAND_FRIEND_SEARCH, COMMAND_GROUPS, COMMAND_PROFILE, COMMAND_MESSAGE, IRequest } from './http';
import { IUser } from '../theme/models/user';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

    /**
     * 在小尺寸下进入聊天界面
     */
    public roomMode = false;

    /**
     * 切换分组
     */
    public tabIndex = 0;
    /**
     * 进入搜索用户
     */
    public searchMode = false;

    public lastFriends: IFriend[] = [];

    public friends: IFriendGroup[] = [];

    public user: IFriend;

    public chatUser: IFriend;

    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public messages: IMessage[] = [];

    public request: IRequest;

    constructor(
        private service: ChatService
    ) {
        this.request = this.service.request;
    }

    ngOnInit(): void {
        this.request.open();
        this.request.on(COMMAND_PROFILE, res => {
            this.user = res;
        }).on(COMMAND_FRIENDS, res => {
            this.friends = res.data;
            if (this.friends.length > 0) {
                this.friends[0].expand = true;
            }
        }).on(COMMAND_GROUPS, res => {

        }).on(COMMAND_FRIEND_SEARCH, res => {

        }).on(COMMAND_MESSAGE, res => {
            this.page = res.paging.offset;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.messages = this.page < 2 ? res.data : [].concat(this.messages, res.data);
        });

        this.request.emit(COMMAND_PROFILE)
        .emit(COMMAND_FRIENDS);
    }

    ngOnDestroy() {
        this.request.close();
    }

    public tapAdd(event: Event) {
        event.stopPropagation();
    }

    public tapUser(item: IFriend) {
        if (item.user.id === this.user.user.id) {
            return;
        }
        this.roomMode = true;
        this.chatUser = item;
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.request.emit(COMMAND_MESSAGE, this.chatUser.id);
    }
}
