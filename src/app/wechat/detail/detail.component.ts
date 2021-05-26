import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: any;

    constructor(
        private service: WechatService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.media(params.id).subscribe(res => {
                this.data = res;
            });
        });
    }

}
