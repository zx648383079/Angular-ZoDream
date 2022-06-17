import { Component, OnInit } from '@angular/core';
import { WechatService } from './wechat.service';

@Component({
  selector: 'app-wechat-backend',
  templateUrl: './wechat-backend.component.html',
  styleUrls: ['./wechat-backend.component.scss']
})
export class WechatBackendComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: WechatService
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
