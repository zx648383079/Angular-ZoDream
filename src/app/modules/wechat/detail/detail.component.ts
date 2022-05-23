import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { hasElementByClass } from '../../../theme/utils';
import { IWeChatMedia } from '../model';
import { WechatService } from '../wechat.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IWeChatMedia;
    public renderHtml: any;
    public dropToggle = false;

    @HostListener('document:click', ['$event']) hideCalendar(event: any) {
        if (!event.target.closest('.rich_media_meta_nickname') && !hasElementByClass(event.path, 'drop-box')) {
            this.dropToggle = false;
        }
    }

    constructor(
        private service: WechatService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.media({
                wid: params.wid,
                id: params.id
            }).subscribe({
                next: res => {
                    this.data = res;
                    this.renderHtml = this.sanitizer.bypassSecurityTrustHtml(res.content);
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
    }

}
