import { Component, OnInit } from '@angular/core';
import { FrontendService } from '../frontend.service';
import { IFriendLink, ILink } from '../../theme/models/seo';
import { emptyValidate } from '../../theme/validators';
import { DialogService } from '../../components/dialog';
import { DialogBoxComponent } from '../../components/dialog';

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
        private toastrService: DialogService,
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
                this.toastrService.success($localize `Submitted successfully, waiting for the administrator to process`);
            });
        }, () => {
            return !emptyValidate(this.editData.url) && !emptyValidate(this.editData.name)
        });
    }

}
