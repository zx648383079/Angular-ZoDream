import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { emptyValidate } from '../../../theme/validators';
import { MicroService } from '../micro.service';

@Component({
    standalone: false,
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
        $localize `Public`, 
        $localize `Tucao`, 
        $localize `Private`
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: MicroService,
        private toastrService: DialogService,
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
            this.service.shareCheck(this.data).subscribe({
                error: err => {
                    this.toastrService.warning(err);
                    // this.router.navigate(['../'], {relativeTo: this.route});
                }
            });
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (emptyValidate(this.data.content)) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        e?.enter();
        this.service.shareSave(this.data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Successful sharing`);
                this.router.navigate(['../'], {relativeTo: this.route});
            }, 
            error: err => {
                e?.reset();
                this.toastrService.warning(err);
            }
        });
    }

    public tapRemoveImage(i: number) {
        this.data.pics.splice(i, 1);
    }

}
