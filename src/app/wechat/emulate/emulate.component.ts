import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IWeChatAccount } from '../model';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-emulate',
  templateUrl: './emulate.component.html',
  styleUrls: ['./emulate.component.scss']
})
export class EmulateComponent implements OnInit {

    public account: IWeChatAccount;

    public menuItems = [];

    constructor(
        private service: WechatService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.get(params.id).subscribe((res: any) => {
                this.account = res;
                if (res.menu_list) {
                    this.menuItems = res.menu_list;
                }
            });
        });
    }

}
