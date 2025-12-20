import { Component, Injector, OnDestroy, OnInit, ViewContainerRef, computed, inject, signal, viewChild } from '@angular/core';
import {
    ChatService
} from './chat.service';
import {
    IMessage,
    IFriend,
    IFriendGroup,
    IChatHistory,
    IGroup,
    IChatWith
} from './model';
import { COMMAND_MESSAGE, IRequest, COMMAND_MESSAGE_PING, COMMAND_ERROR, COMMAND_HISTORY, COMMAND_PROFILE, COMMAND_FRIENDS, COMMAND_GROUPS } from './http';
import { emptyValidate } from '../../theme/validators';
import { IEmoji } from '../../theme/models/seo';
import { Recorder } from './recorder';
import { AuthService, ThemeService } from '../../theme/services';
import { ContextMenuComponent } from '../../components/context-menu';
import { IMessageBase } from '../../components/message-container';
import { DialogService } from '../../components/dialog';
import { SearchDialogComponent } from './search/search-dialog.component';
import { IUser } from '../../theme/models/user';
import { ApplyDialogComponent } from './apply/apply-dialog.component';
import { RenameDialogComponent } from './rename/rename-dialog.component';
import { ProfileDialogComponent } from './profile/profile-dialog.component';
import { SelectDialogComponent } from './select/select-dialog.component';
import { form, required } from '@angular/forms/signals';

const LOOP_SPACE_TIME = 20;
interface IChatUser extends IChatWith {
    name: string;
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
    standalone: false,
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    private readonly service = inject(ChatService);
    private readonly toastrService = inject(DialogService);
    private readonly authService = inject(AuthService);
    private readonly themeService = inject(ThemeService);
    private injector = inject(Injector);


    public readonly contextMenu = viewChild(ContextMenuComponent);
    private readonly modalViewContainer = viewChild('modalVC', { read: ViewContainerRef });


    /**
     * 在小尺寸下进入聊天界面
     */
    public roomMode = false;

    public navOpen = false;

    /**
     * 切换分组
     */
    public tabIndex = 0;
    /**
     * 进入搜索用户
     */
    public searchMode = false;
    public readonly searchForm = form(signal({
        keywords: ''
    }));

    public histories: IChatHistory[] = [];

    public friends: IFriendGroup[] = [];

    public user: IFriend;

    public chatUser: IChatUser;

    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public messageItems: IMessageBase[] = [];
    public readonly messageForm = form(signal({
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });
    public recording = false;
    private nextTime = 0;
    private startTime = 0;
    private spaceTime = 0;
    private timer = 0;
    private recorder: Recorder;


    public request: IRequest;
    public editClassify: any = {
        id: 0,
        name: ''
    };
    public editProfile: any = {
        remark: '',
    };

    constructor() {
        this.themeService.titleChanged.next($localize `Chat`);
        this.request = this.service.createRequest();
        this.recorder = new Recorder();
    }

    ngOnInit(): void {
        this.request.open(() => {
            this.initRequest();
        });
        this.service.batch({
            [COMMAND_HISTORY]: {},
            [COMMAND_PROFILE]: {},
            [COMMAND_FRIENDS]: {},
            [COMMAND_GROUPS]: {},
        }).subscribe(res => {
            this.friends = res[COMMAND_FRIENDS].data;
            this.histories = res[COMMAND_HISTORY].data;
            this.user = res[COMMAND_PROFILE];
        });
    }

    ngOnDestroy() {
        this.request.close();
    }

    private initRequest() {
        this.request.auth(this.authService.getUserToken())
        .on(COMMAND_ERROR, res => {
            this.toastrService.warning(typeof res === 'object' ? res.message : res);
        }).on(COMMAND_MESSAGE, res => {
            if (!res.data) {
                return;
            }
            if (!(res.data instanceof Array)) {
                res.data = [res.data];
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
            if (res.apply_count > 0) {
                this.tapApplyLog();
            }
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
        });
    }

    public readonly searchItems = computed(() => {
        const keywords = this.searchForm.keywords().value();
        if (emptyValidate(keywords)) {
            return [];
        }
        const items = [];
        for (const group of this.friends) {
            for (const item of group.users) {
                if (item.name.indexOf(keywords) >= 0) {
                    items.push(item);
                }
            }
        }
        return items;
    });

    public tapCloseFilter() {
        this.searchMode = false;
        this.searchForm.keywords().value.set('');
    }

    public tapContextMenu(e: MouseEvent, user?: IUser) {
        this.contextMenu().show(e, !user ? [
            {
                name: '新建分组',
                icon: 'icon-plus',
                onTapped: () => this.tapRename()
            }] : [
            {
                name: '修改备注',
                icon: 'icon-edit',
                onTapped: () => this.tapRename(user)
            },
            {
                name: '移至分组',
                icon: 'icon-mark1',
                onTapped: () => this.tapMoveGroup(user)
            },
            {
                name: '查看资料',
                icon: 'icon-user',
                onTapped: () => this.tapProfile(user)
            },
        ]);
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
            name: item.item_type > 0 ? item.group.name : (item.friend ? item.friend.name : item.user.name),
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
            const blob = this.recorder.toBlob();
            if (!blob) {
                this.toastrService.warning('录音失败');
                return;
            }
            const form = new FormData();
            form.append('file', blob, 'voice.mp3');
            this.service.sendVoice(this.chatUser, form).subscribe(res => this.addMessage(res.data));
        });
    }

    public tapEmoji(item: IEmoji) {
        this.messageForm.content().value.update(v => v + (item.type > 0 ? item.content : '[' + item.name + ']'));
    }

    public uploadImage(event: any) {
        const files = event.target.files as FileList;
        this.service.sendImage(this.chatUser, files).subscribe(res => this.addMessage(res.data));
    }

    public uploadVideo(event: any) {
        const files = event.target.files as FileList;
        this.service.sendVideo(this.chatUser, files).subscribe(res => this.addMessage(res.data));
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.service.sendFile(this.chatUser, files).subscribe(res => this.addMessage(res.data));
    }

    public tapSend() {
        if (this.messageForm().invalid()) {
            return;
        }
        this.service.sendText(this.chatUser, this.messageForm.content().value())
            .subscribe(res => this.addMessage(res.data));
        this.messageForm.content().value.set('');
    }

    private addMessage(data: IMessage|IMessage[]) {
        if (!data) {
            return;
        }
        if (data instanceof Array) {
            this.messageItems = [].concat(this.messageItems, data);
        } else {
            this.messageItems.push(data);
        }
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

    public tapApplyLog() {
        this.navOpen = false;
        const modalRef = this.modalViewContainer().createComponent(ApplyDialogComponent, {
            injector: this.injector
        });
        modalRef.instance.open(() => {
            modalRef.destroy();
        });
    }

    public tapRename(user?: IUser) {
        this.navOpen = false;
        const modalRef = this.modalViewContainer().createComponent(RenameDialogComponent, {
            injector: this.injector
        });
        modalRef.instance.open(() => {
            modalRef.destroy();
        });
    }

    public tapProfile(user?: IUser) {
        this.navOpen = false;
        const modalRef = this.modalViewContainer().createComponent(ProfileDialogComponent, {
            injector: this.injector
        });
        modalRef.instance.open(user ?? this.user.user, () => {
            modalRef.destroy();
        });
    }

    public tapMoveGroup(item: IUser) {
        this.navOpen = false;
        const modalRef = this.modalViewContainer().createComponent(SelectDialogComponent, {
            injector: this.injector
        });
        modalRef.instance.open(this.friends, 0, res => {
            if (res) {
                this.service.friendMove({user: item.id, group: modalRef.instance.selected}).subscribe(_ => {});
            }
            modalRef.destroy();
        });
    }

    public tapAdd(event: Event) {
        event.stopPropagation();
        const modalRef = this.modalViewContainer().createComponent(SearchDialogComponent, {
            injector: this.injector
        });
        modalRef.instance.open(() => {
            modalRef.destroy();
        });
    }
}
