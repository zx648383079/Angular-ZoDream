import { Component, OnDestroy } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { IEmoji } from '../../theme/models/seo';
import { OnlineService } from './online.service';

const LOOP_SPACE_TIME = 20;
const SESSION_KEY = 'session_token';

@Component({
  selector: 'app-online-service',
  templateUrl: './online-service.component.html',
  styleUrls: ['./online-service.component.scss']
})
export class OnlineServiceComponent implements OnDestroy {

    public dialogOpen = false;
    public content = '';
    public items: any[] = [];
    private sessionToken = '';
    private nextTime = 0;
    private startTime = 0;
    private spaceTime = 0;
    private isLoading = false;
    private timer = 0;

    constructor(
        private service: OnlineService,
        private toastrService: DialogService,
    ) {
        this.sessionToken = window.localStorage.getItem(SESSION_KEY) || '';
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    public tapOpenChat() {
        this.dialogOpen = true;
        if (this.sessionToken.length > 0) {
            this.tapNext();
        }
    }

    public tapSend() {
        const content = this.content;
        if (content.length < 1) {
            this.toastrService.warning($localize `Please input the content of the inquiry`);
            return;
        }
        this.send({content});
        this.content = '';
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
        this.content += item.type > 0 ? item.content : '[' + item.name + ']';
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
                this.items = [].concat(res.data, this.items);
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
        this.service.send(data).subscribe((res: any) => {
            this.items = [].concat(this.items, res.data);
            this.nextTime = res.next_time;
            if (!this.startTime) {
                this.startTime = this.nextTime;
            }
            this.sessionToken = res.session_token;
            this.spaceTime = LOOP_SPACE_TIME;
            this.isLoading = false;
            this.saveToken();
            this.startTimer();
        }, _ => {
            this.isLoading = false;
        });
    }

    private startTimer() {
        if (this.timer > 0) {
            return;
        }
        this.timer = window.setInterval(() => {
            if (this.isLoading) {
                return;
            }
            this.spaceTime --;
            if (this.spaceTime > 0) {
                return;
            }
            this.tapNext();
        }, 1000);
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
                    this.items = [].concat(this.items, res.data);
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
        if (this.timer > 0) {
            window.clearInterval(this.timer);
            this.timer = 0;
        }
    }

    private saveToken() {
        if (this.sessionToken.length < 1) {
            return;
        }
        window.localStorage.setItem(SESSION_KEY, this.sessionToken);
    }
}
