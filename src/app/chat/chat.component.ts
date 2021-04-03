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
    IFriendGroup,
    IChatHistory,
    IGroup
} from '../theme/models/chat';
import { COMMAND_FRIENDS, COMMAND_FRIEND_SEARCH, COMMAND_GROUPS, COMMAND_PROFILE, COMMAND_MESSAGE, IRequest, COMMAND_FRIEND_APPLY, COMMAND_MESSAGE_SEND, COMMAND_MESSAGE_SEND_TEXT, COMMAND_HISTORY, COMMAND_MESSAGE_SEND_IMAGE, COMMAND_MESSAGE_SEND_VIDEO, COMMAND_MESSAGE_SEND_FILE, COMMAND_MESSAGE_SEND_AUDIO, COMMAND_MESSAGE_PING } from './http';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { IPage } from '../theme/models/page';
import { IUser } from '../theme/models/user';
import { DialogBoxComponent } from '../theme/components';
import { emptyValidate } from '../theme/validators';
import { ToastrService } from 'ngx-toastr';
import { IEmoji } from '../theme/models/seo';
import { Recorder } from './recorder';

const LOOP_SPACE_TIME = 20;
interface IChatUser {
    name: string;
    type: number;
    id: number;
    avatar: string;
}

interface IMessagePing {
    message_count: number;
    apply_count: number;
    data: {
        type: number;
        id: number;
        items: IMessage[];
    }[];
    next_time: number;
}

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
    public searchKeywords = '';

    public histories: IChatHistory[] = [];

    public friends: IFriendGroup[] = [];

    public user: IFriend;

    public chatUser: IChatUser;

    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public messageItems: IMessage[] = [];
    public messageContent = '';
    public recording = false;
    private nextTime = 0;
    private startTime = 0;
    private spaceTime = 0;
    private timer = 0;
    private recorder: Recorder;


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
        this.recorder = new Recorder();
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

        }).on(COMMAND_HISTORY, (res: IPage<IChatHistory>) => {
            this.histories = res.paging.limit < 1 ? res.data : [].concat(this.histories, res.data);
        }).on(COMMAND_FRIEND_SEARCH, res => {

        }).on(COMMAND_MESSAGE, res => {
            if (!res.data) {
                return;
            }
            if (res.data.length > 0) {
                this.messageItems = [].concat(this.messageItems, res.data);
            }
            if (res.next_time) {
                this.nextTime = res.next_time;
            }
            if (!this.startTime) {
                this.startTime = this.nextTime;
            }
            this.spaceTime = LOOP_SPACE_TIME;
            this.isLoading = false;
            this.startTimer();
        }).on(COMMAND_MESSAGE_PING, (res: IMessagePing) => {
            if (res.data && res.data.length > 0 && this.chatUser) {
                for (const item of res.data) {
                    if (item.type === this.chatUser.type && item.id === this.chatUser.id) {
                        this.messageItems = [].concat(this.messageItems, item.items);
                    }
                }
            }
            if (res.next_time) {
                this.nextTime = res.next_time;
            }
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
        }).on([
            COMMAND_MESSAGE_SEND_TEXT,
            COMMAND_MESSAGE_SEND_FILE,
            COMMAND_MESSAGE_SEND_VIDEO,
            COMMAND_MESSAGE_SEND_AUDIO,
            COMMAND_MESSAGE_SEND_IMAGE
        ], res => {
            if (!res.data) {
                return;
            }
            this.request.trigger(COMMAND_MESSAGE, res.data instanceof Array ? res : {data: [res.data]});
        });

        this.request.emitBatch({
            [COMMAND_PROFILE]: {},
            [COMMAND_HISTORY]: {},
            [COMMAND_FRIENDS]: {},
            [COMMAND_GROUPS]: {}
        });
    }

    ngOnDestroy() {
        this.request.close();
    }

    public get searchItems() {
        if (emptyValidate(this.searchKeywords)) {
            return [];
        }
        const items = [];
        for (const group of this.friends) {
            for (const item of group.users) {
                if (item.name.indexOf(this.searchKeywords) >= 0) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    public tapCloseFilter() {
        this.searchMode = false;
        this.searchKeywords = '';
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

    /**
     * 点击消息记录开启聊天
     * @param item 
     */
    public tapHistory(item: IChatHistory) {
        this.openChatRoom({
            id: item.item_id,
            type: item.item_type,
            name: item.item_type > 0 ? item.group.name : item.friend.name,
            avatar: item.item_type > 0 ? item.group.logo : item.user.avatar,
        });
    }

    private openChatRoom(item: IChatUser) {
        this.roomMode = true;
        if (this.chatUser && this.chatUser.id === item.id && this.chatUser.type === item.type) {
            return;
        }
        this.chatUser = item;
        this.nextTime = 0;
        this.tapRefresh();
    }

    /**
     * 点击好友，开启聊天
     * @param item 
     * @returns 
     */
    public tapUser(item: IFriend) {
        if (item.user.id === this.user.user.id) {
            return;
        }
        this.openChatRoom({
            id: item.user.id,
            type: 0,
            name: item.name,
            avatar: item.user.avatar,
        });
    }

    /**
     * 点击群，开启群聊天
     * @param item 
     */
    public tapGroup(item: IGroup) {
        this.openChatRoom({
            id: item.id,
            type: 1,
            name: item.name,
            avatar: item.logo,
        });
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
        if (this.isLoading || !this.chatUser) {
            return;
        }
        this.isLoading = true;
        this.request.emit(COMMAND_MESSAGE, {
            type: this.chatUser.type,
            id: this.chatUser.id
        });
    }

    public tapVoice() {
        this.recorder.open(() => {
            if (this.recorder.isPaused) {
                this.recorder.start();
                this.recording = true;
                return;
            }
            this.recorder.stop();
            this.recording = false;
            const form = new FormData();
            form.append('file', this.recorder.toBlob(), 'voice.mp3');
            this.send(COMMAND_MESSAGE_SEND_AUDIO, form);
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
        this.send(COMMAND_MESSAGE_SEND_IMAGE, form);
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            form.append('file', files[i], files[i].name);
        }
        this.send(COMMAND_MESSAGE_SEND_VIDEO, form);
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            form.append('file', files[i], files[i].name);
        }
        this.send(COMMAND_MESSAGE_SEND_FILE, form);
    }

    public tapSend() {
        if (emptyValidate(this.messageContent)) {
            return;
        }
        this.send(COMMAND_MESSAGE_SEND_TEXT, {
            content: this.messageContent,
        });
        this.messageContent = '';
    }

    private send(event: string, data: any) {
        if (!this.chatUser) {
            return;
        }
        if (data instanceof FormData) {
            data.append('type', this.chatUser.type.toString());
            data.append('id', this.chatUser.id.toString());
            data.append('start_time', this.nextTime as any);
        } else {
            data.type = this.chatUser.type;
            data.id = this.chatUser.id;
            data.start_time = this.nextTime;
        }
        this.isLoading = true;
        this.request.emit(event, data);
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
        this.request.emit(COMMAND_MESSAGE_PING, {
            type: this.chatUser.type,
            id: this.chatUser.id,
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
