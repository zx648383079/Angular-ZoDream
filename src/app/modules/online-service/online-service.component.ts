import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { IEmoji } from '../../theme/models/seo';
import { OnlineService } from './online.service';
import { form, required } from '@angular/forms/signals';
import { interval, Subscription } from 'rxjs';
import { KeepAliveService } from '../../theme/services/keep-alive.service';

const LOOP_SPACE_TIME = 20;
const SESSION_KEY = 'session_token';

@Component({
    standalone: false,
    selector: 'app-online-service',
    templateUrl: './online-service.component.html',
    styleUrls: ['./online-service.component.scss']
})
export class OnlineServiceComponent {
    private readonly service = inject(OnlineService);
    private readonly liveService = inject(KeepAliveService);
    private readonly toastrService = inject(DialogService);
    private readonly destroyRef = inject(DestroyRef);


    public readonly dialogOpen = signal(false);
    public readonly dataForm = form(signal({
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });
    public readonly items = signal<any[]>([]);
    private sessionToken = '';
    private nextTime = 0;
    private startTime = 0;
    private spaceTime = 0;
    private isLoading = false;
    private $timer: Subscription;

    constructor() {
        this.sessionToken = window.localStorage.getItem(SESSION_KEY) || '';
        this.destroyRef.onDestroy(() => this.stopTimer());
    }

    public tapOpenChat() {
        this.dialogOpen.set(true);
        if (this.sessionToken.length > 0) {
            this.tapNext();
        }
    }

    public tapSend() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Please input the content of the inquiry`);
            return;
        }
        this.send(this.dataForm().value());
        this.dataForm.content().value.set('');
    }

    public tapUploadImage(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < files.length; i++) {
            form.append('file[]', files[i], files[i].name);
        }
        this.send(form);
    }

    public tapEmoji(item: IEmoji) {
        this.dataForm.content().value.update(v => v + (item.type > 0 ? item.content : '[' + item.name + ']'));
    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapSend();
    }

    public tapMore(lastId: number) {
        if (lastId < 1) {
            return;
        }
        this.service.getList({
            session_token: this.sessionToken,
            last_id: lastId,
        }).subscribe((res: any) => {
            if (res.data.length > 0) {
                this.items.set([].concat(res.data, this.items));
            }
        });
    }

    private send(data: any) {
        if (data instanceof FormData) {
            data.append('session_token', this.sessionToken);
            data.append('start_time', this.nextTime as any);
        } else {
            data.session_token = this.sessionToken;
            data.start_time = this.nextTime;
        }
        this.isLoading = true;
        this.service.send(data).subscribe({
            next:(res: any) => {
                this.items.set([].concat(this.items, res.data));
                this.nextTime = res.next_time;
                if (!this.startTime) {
                    this.startTime = this.nextTime;
                }
                this.sessionToken = res.session_token;
                this.spaceTime = LOOP_SPACE_TIME;
                this.isLoading = false;
                this.saveToken();
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
                return;
            }
            this.spaceTime --;
            if (this.spaceTime > 0) {
                return;
            }
            this.tapNext();
        });
    }

    private tapNext() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.getList({
            session_token: this.sessionToken,
            start_time: this.nextTime,
        }).subscribe({
            next: (res: any) => {
                if (res.data.length > 0) {
                    this.items.set([].concat(this.items, res.data));
                }
                this.nextTime = res.next_time;
                if (!this.startTime) {
                    this.startTime = this.nextTime;
                }
                this.sessionToken = res.session_token;
                this.spaceTime = LOOP_SPACE_TIME;
                this.isLoading = false;
                this.startTimer();
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    private stopTimer() {
        if (this.$timer) {
            this.$timer.unsubscribe();
            this.$timer = null;
        }
    }

    private saveToken() {
        if (this.sessionToken.length < 1) {
            return;
        }
        window.localStorage.setItem(SESSION_KEY, this.sessionToken);
    }
}
