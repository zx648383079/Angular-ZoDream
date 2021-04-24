import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IErrorResult } from '../../theme/models/page';
import { emptyValidate } from '../../theme/validators';
import { MicroService } from '../micro.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

    public data = {
        shareappid: '',
        title: '',
        summary: '',
        url: '',
        pics: [],
        sharesource: '',
        content: '',
        open_type: 0,
    };

    public typeItems = [
        '公开', '吐槽', '私人'
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: MicroService,
        private toastrService: ToastrService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.data = {
                shareappid: params.appid || '',
                title: params.title || '',
                summary: params.summary || '',
                url: params.url || '',
                pics: params.pics ? (params.pics instanceof Array ? params.pics : [params.pics]) : [],
                sharesource: params.sharesource || '',
                content: '',
                open_type: 0,
            };
            this.service.shareCheck(this.data).subscribe(_ => {

            }, (err: IErrorResult) => {
                this.toastrService.warning(err.error.message);
                // this.router.navigate(['../'], {relativeTo: this.route});
            });
        });
    }

    public tapSubmit() {
        if (emptyValidate(this.data.content)) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.shareSave(this.data).subscribe(_ => {
            this.toastrService.success('分享成功');
            this.router.navigate(['../'], {relativeTo: this.route});
        }, (err: IErrorResult) => {
            this.toastrService.warning(err.error.message);
        });
    }

    public tapRemoveImage(i: number) {
        this.data.pics.splice(i, 1);
    }

}
