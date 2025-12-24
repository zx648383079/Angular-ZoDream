import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../components/dialog';
import { DialogBoxComponent } from '../../../components/dialog';
import { AppState } from '../../../theme/interfaces';
import { IEmoji } from '../../../theme/models/seo';
import { selectAuthUser } from '../../../theme/reducers/auth.selectors';
import { emptyValidate } from '../../../theme/validators';
import { ICategory, ICategoryUser, ISession, IWord } from '../model';
import { OnlineBackendService } from './online.service';
import { form } from '@angular/forms/signals';
import { interval, Subscription } from 'rxjs';

const LOOP_SPACE_TIME = 20;
const LOOP_SESSION_TIME = 120;

@Component({
    standalone: false,
    selector: 'app-service-backend',
    templateUrl: './service-backend.component.html',
    styleUrls: ['./service-backend.component.scss']
})
export class ServiceBackendComponent implements OnInit, OnDestroy {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly service = inject(OnlineBackendService);
    private readonly toastrService = inject(DialogService);

    public readonly dataForm = form(signal({
        keywords: '',
        service_word: '',
        message: '',
        remark: '',
        user_keywords: ''
    }));

    public readonly tabIndex = signal(0);
    public expandIndex = 0;
    public categories: ICategory[] = [];
    public sessionItems: ISession[] = [];
    public session: ISession;
    public messageItems = [];
    public users: ICategoryUser[] = [];
    public userSelected = 0;

    public currentUser = 0;
    private nextTime = 0;
    private startTime = 0;
    private spaceTime = 0;
    private sessionTime = 0;
    private isLoading = false;
    private $timer: Subscription;

    constructor() {
        this.store.select(selectAuthUser).subscribe(user => {
            if (!user) {
                return;
            }
            this.currentUser = user.id;
        });
    }

    ngOnInit() {
        this.service.wordAll().subscribe(res => {
            this.categories = res.data;
        });
        this.refreshSession();
        this.startTimer();
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    public get autoWords() {
        for (const item of this.categories) {
            if (item.name.indexOf('自动回复') >= 0) {
                return item.words;
            }
        }
        return [];
    }

    public readonly sessionItems1 = computed(() => {
        const keywords = this.dataForm.keywords().value();
        return this.sessionItems.filter(i => {
            if (i.status !== 1) {
                return false;
            }
            return keywords.trim().length < 0 || i.name.indexOf(keywords) >= 0;
        });
    });

    public readonly sessionItems2 = computed(() => {
        const keywords = this.dataForm.keywords().value();
        return this.sessionItems.filter(i => {
            if (i.status > 0) {
                return false;
            }
            return keywords.trim().length < 0 || i.name.indexOf(keywords) >= 0;
        });
    });
    public readonly sessionItems3 = computed(() => {
        const keywords = this.dataForm.keywords().value();
        return this.sessionItems.filter(i => {
            if (i.status < 2) {
                return false;
            }
            return keywords.trim().length < 0 || i.name.indexOf(keywords) >= 0;
        });
    });

    public tapSession(item: ISession) {
        if (!this.session || this.session.id !== item.id) {
            this.messageItems = [];
            this.startTime = 0;
            this.nextTime = 0;
            this.session = item;
            this.dataForm.service_word().value.set(item.service_word as any);
            this.tapNext();
        }
    }

    public tapWord(item: IWord) {
        this.dataForm.message().value.set(item.content);
    }

    public tapSend() {
        const content = this.dataForm.message().value();
        if (content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.send({content});
        this.dataForm.message().value.set('');
    }

    public onReplyChange() {
        this.service.sessionReply({
            session_id: this.session.id,
            word: this.dataForm.service_word().value(),
        }).subscribe(res => {
            this.session = res;
            this.dataForm.service_word().value.set(res.service_word as any);
        });
    }

    public onSearchUser() {
        this.service.userList({
            keywords: this.dataForm.user_keywords().value(),
            per_page: 10,
        }).subscribe(res => {
            this.users = res.data.filter(i => {
                return i.user_id !== this.currentUser;
            });
        });
    }

    public openTransfer(modal: DialogBoxComponent) {
        this.userSelected = 0;
        modal.open(() => {
            this.service.sessionTransfer({
                session_id: this.session.id,
                user: this.userSelected,
            }).subscribe(res => {
                this.toastrService.success('会话转交成功');
                this.tapClose();
                this.refreshSession();
            });
        }, () => this.userSelected > 0);
    }

    public openRemark(modal: DialogBoxComponent) {
        this.dataForm.remark().value.set('');
        modal.open(() => {
            this.service.sessionRemark({
                session_id: this.session.id,
                remark: this.dataForm.remark().value(),
            }).subscribe(res => {
                this.toastrService.success('备注成功成功');
                this.session = res;
            });
        }, () => !emptyValidate(this.dataForm.remark().value()));
    }

    public tapClose() {
        this.session = undefined;
        this.messageItems = [];
        this.startTime = 0;
        this.nextTime = 0;
    }

    public tapEmoji(item: IEmoji) {
        this.dataForm.message().value.update(v => v + (item.type > 0 ? item.content : '[' + item.name + ']'));
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

    private send(data: any) {
        if (!this.session) {
            return;
        }
        if (data instanceof FormData) {
            data.append('session_id', this.session.id.toString());
            data.append('start_time', this.nextTime as any);
        } else {
            data.session_id = this.session.id;
            data.start_time = this.nextTime;
        }
        this.isLoading = true;
        this.service.send(data).subscribe({
            next: (res: any) => {
                this.messageItems = [].concat(this.messageItems, res.data);
                this.nextTime = res.next_time;
                if (!this.startTime) {
                    this.startTime = this.nextTime;
                }
                this.spaceTime = LOOP_SPACE_TIME;
                this.isLoading = false;
                this.startTimer();
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    private startTimer() {
        if (this.$timer) {
            return;
        }
        this.$timer = interval(1000).subscribe(() => {
            if (this.isLoading) {

            }
            this.sessionTime --;
            if (this.sessionTime < 0) {
                this.refreshSession();
            }
            if (!this.session) {
                return;
            }
            this.spaceTime --;
            if (this.spaceTime < 0) {
                this.tapNext();
            }
        });
    }

    private tapNext() {
        this.isLoading = true;
        this.service.messageList({
            session_id: this.session.id,
            start_time: this.nextTime,
        }).subscribe({
            next: (res: any) => {
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
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    private refreshSession() {
        this.sessionTime = LOOP_SESSION_TIME;
        this.service.sessionMy().subscribe(res => {
            this.sessionItems = res.data;
            this.sessionTime = LOOP_SESSION_TIME;
        });
    }

    private stopTimer() {
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
        }
    }
}
