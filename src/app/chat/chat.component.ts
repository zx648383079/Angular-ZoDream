import {
    Component,
    OnInit
} from '@angular/core';
import {
    ChatService
} from './chat.service';
import {
    IUser,
    IUserGroup,
    IMessage
} from '../theme/models/chat';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

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

    public lastFriends: IUser[] = [];

    public friends: IUserGroup[] = [];

    public user: IUser;

    public chatUser: IUser;

    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public messages: IMessage[] = [];

    private ws: WebSocket;

    constructor(
        private service: ChatService
    ) {}

    ngOnInit(): void {
        this.service.getFriends().subscribe(res => {
            if (res.length > 0) {
                res[0].expand = true;
            }
            this.friends = res;
            this.user = res[0].children[0];
        });
    }

    public tapAdd(event: Event) {
        event.stopPropagation();
    }

    public tapUser(user: IUser) {
        if (user.id === this.user.id) {
            return;
        }
        this.roomMode = true;
        this.chatUser = user;
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
        this.service.getMessages(this.chatUser.id).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.messages = page < 2 ? res.data : [].concat(this.messages, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}