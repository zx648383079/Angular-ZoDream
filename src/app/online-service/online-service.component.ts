import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnlineService } from './online.service';

const LOOP_SPACE_TIME = 20;

@Component({
  selector: 'app-online-service',
  templateUrl: './online-service.component.html',
  styleUrls: ['./online-service.component.scss']
})
export class OnlineServiceComponent {

    public dialogOpen = false;
    public content = '';
    public items: any[] = [];
    public currentId = 0;
    private sessionToken = '';
    private nextTime = 0;
    private startTime = 0;
    private spaceTime = 0;
    private isLoading = false;
    private timer = 0;

    constructor(
        private service: OnlineService,
        private toastrService: ToastrService,
    ) { }

    public tapSend() {
        const content = this.content;
        if (content.length < 1) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.send({content});
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

    public onKeyDown(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        this.tapSend();
    }

    public tapMore() {

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
        this.isLoading = true;
        this.service.getList({
            session_token: this.sessionToken,
            start_time: this.nextTime,
        }).subscribe((res: any) => {
            this.items = [].concat(this.items, res.data);
            this.nextTime = res.next_time;
            if (!this.startTime) {
                this.startTime = this.nextTime;
            }
            this.sessionToken = res.session_token;
            this.spaceTime = LOOP_SPACE_TIME;
            this.isLoading = false;
            this.startTimer();
        }, _ => {
            this.isLoading = false;
        });
    }
}
