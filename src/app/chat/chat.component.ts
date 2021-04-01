import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    ChatService
} from './chat.service';
import {
    IMessage,
    IFriend,
    IFriendGroup
} from '../theme/models/chat';
import { COMMAND_FRIENDS, COMMAND_FRIEND_SEARCH, COMMAND_GROUPS, COMMAND_PROFILE, COMMAND_MESSAGE, IRequest, COMMAND_FRIEND_APPLY, COMMAND_MESSAGE_SEND, COMMAND_MESSAGE_SEND_TEXT } from './http';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { IPage } from '../theme/models/page';
import { IUser } from '../theme/models/user';
import { DialogBoxComponent } from '../theme/components';
import { emptyValidate } from '../theme/validators';
import { ToastrService } from 'ngx-toastr';
import { IEmoji } from '../theme/models/seo';

const LOOP_SPACE_TIME = 20;

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;
    @ViewChild('profileModal')
    public profileModal: DialogBoxComponent;
    @ViewChild('classifyModal')
    public classifyModal: DialogBoxComponent;
    @ViewChild('groupModal')
    public groupModal: DialogBoxComponent;


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
    public messageItems: IMessage[] = [];
    public messageContent = '';
    private nextTime = 0;
    private startTime = 0;
    private spaceTime = 0;
    private timer = 0;


    public request: IRequest;
    public searchData =  {
        isInput: false,
        keywords: '',
        items: [],
        tabIndex: 0,
    };
    public editClassify: any = {
        id: 0,
        name: ''
    };
    public editProfile: any = {
        remark: '',
    };

    constructor(
        private service: ChatService,
        private toastrService: ToastrService,
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
            if (res.data.length > 0) {
                this.messageItems = [].concat(this.messageItems, res.data);
            }
            this.nextTime = res.next_time;
            if (!this.startTime) {
                this.startTime = this.nextTime;
            }
            this.spaceTime = LOOP_SPACE_TIME;
            this.isLoading = false;
            this.startTimer();
        }).on(COMMAND_FRIEND_SEARCH, (res: IPage<IUser>) => {
            this.searchData.items = res.data;
        }).on(COMMAND_FRIEND_APPLY, _ => {

        }).on(COMMAND_MESSAGE_SEND, res => {
            this.request.trigger(COMMAND_MESSAGE, res);
        }).on(COMMAND_MESSAGE_SEND_TEXT, res => {
            this.request.trigger(COMMAND_MESSAGE, [res.data]);
        });

        this.request.emit(COMMAND_PROFILE)
        .emit(COMMAND_FRIENDS);
    }

    ngOnDestroy() {
        this.request.close();
    }

    public tapContextMenu(e: MouseEvent) {
        this.contextMenu.show(e.clientX, e.clientY, [
            {
                name: '新建分组',
                icon: 'icon-plus'
            }
        ], item => {
            this.classifyModal.open(() => {
                
            }, () => !emptyValidate(this.editClassify.name));
        });
        return false;
    }

    public tapUser(item: IFriend) {
        if (item.user.id === this.user.user.id) {
            return;
        }
        this.roomMode = true;
        this.chatUser = item;
        this.nextTime = 0;
        this.tapRefresh();
    }



    /** 消息操作 start */

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
        this.request.emit(COMMAND_MESSAGE, {
            type: 0,
            id: this.chatUser.user.id
        });
    }

    public tapEmoji(item: IEmoji) {
        this.messageContent += item.type > 0 ? item.content : '[' + item.name + ']';
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            form.append('file[]', files[i], files[i].name);
        }
        form.append('type', '1');
        this.send(form);
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            form.append('file[]', files[i], files[i].name);
        }
        form.append('type', '2');
        this.send(form);
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            form.append('file[]', files[i], files[i].name);
        }
        form.append('type', '3');
        this.send(form);
    }

    public tapSend() {
        if (emptyValidate(this.messageContent)) {
            return;
        }
        this.request.emit(COMMAND_MESSAGE_SEND_TEXT, {
            type: 0,
            id: this.chatUser.user.id,
            start_time: this.nextTime,
            content: this.messageContent,
        });
        this.messageContent = '';
    }

    private send(data: any) {
        if (!this.chatUser) {
            return;
        }
        if (data instanceof FormData) {
            data.append('type', '0');
            data.append('id', this.chatUser.user.id.toString());
            data.append('start_time', this.nextTime as any);
        } else {
            data.type = 0;
            data.id = this.chatUser.user.id;
            data.start_time = this.nextTime;
        }
        this.isLoading = true;
        this.request.emit(COMMAND_MESSAGE_SEND, data);
    }

    private startTimer() {
        if (this.timer > 0) {
            return;
        }
        this.timer = window.setInterval(() => {
            if (this.isLoading) {

            }
            if (!this.chatUser) {
                return;
            }
            this.spaceTime --;
            if (this.spaceTime < 0) {
                this.tapNext();
            }
        }, 1000);
    }

    private tapNext() {
        this.isLoading = true;
        this.request.emit(COMMAND_MESSAGE, {
            type: 0,
            id: this.chatUser.user.id,
            start_time: this.nextTime,
        });
    }

    private stopTimer() {
        if (this.timer > 0) {
            window.clearInterval(this.timer);
            this.timer = 0;
        }
    }

    /** 消息操作 end */

    /*** 搜索页面 start */

    public tapAdd(event: Event, searchModal: DialogBoxComponent) {
        event.stopPropagation();
        searchModal.openCustom(item => {
            if (!item) {
                return;
            }
            this.editProfile.user = item;
            this.editProfile.editable = false;
            this.profileModal.open(() => {
                this.groupModal.open(() => {
                    this.request.emit(COMMAND_FRIEND_APPLY, {
                        user: item.id,
                        group: this.editClassify.id,
                        remark: this.editProfile.remark
                    });
                });
            });
        });
    }

    public tapSearchTab(i: number) {
        this.searchData.tabIndex = i;
    }

    public tapSearchInput() {
        this.searchData.isInput = true;
    }

    public tapSearchClear() {
        this.searchData.keywords = '';
        this.searchData.isInput = false;
    }

    public onSearchKeyDown(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        this.request.emit(COMMAND_FRIEND_SEARCH, {keywords: this.searchData.keywords});
    }

    /** 搜索页面 end */
}
