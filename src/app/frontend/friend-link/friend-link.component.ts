import { Component, OnInit } from '@angular/core';
import { FrontendService } from '../frontend.service';
import { IFriendLink, ILink } from '../../theme/models/seo';
import { DialogBoxComponent } from '../../theme/components';
import { emptyValidate } from '../../theme/validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-friend-link',
  templateUrl: './friend-link.component.html',
  styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {

    public title = 'Friend Link';
    public friendLinks: ILink[] = [];
    public editData: IFriendLink = {
        name: '',
        url: '',
        brief: '',
        email: '',
    } as any;

    constructor(
        private service: FrontendService,
        private toastrService: ToastrService,
    ) {
        this.service.friendLinks().subscribe(res => {
            this.friendLinks = res;
        });
    }

    ngOnInit() {
    }

    public openApply(modal: DialogBoxComponent) {
        modal.open(() => {
            this.service.linkApply(this.editData).subscribe(_ => {
                this.toastrService.success('提交成功，等待管理员处理');
            });
        }, () => {
            return !emptyValidate(this.editData.url) && !emptyValidate(this.editData.name)
        });
    }

}
