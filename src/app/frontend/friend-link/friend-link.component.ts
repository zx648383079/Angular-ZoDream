import { Component, OnInit, inject } from '@angular/core';
import { FrontendService } from '../frontend.service';
import { IFriendLink, ILink } from '../../theme/models/seo';
import { emptyValidate } from '../../theme/validators';
import { DialogService } from '../../components/dialog';
import { DialogBoxComponent } from '../../components/dialog';
import { ThemeService } from '../../theme/services';

@Component({
    standalone: false,
  selector: 'app-friend-link',
  templateUrl: './friend-link.component.html',
  styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {
    private service = inject(FrontendService);
    private toastrService = inject(DialogService);
    private themeService = inject(ThemeService);


    public friendLinks: ILink[] = [];
    public editData: IFriendLink = {
        name: '',
        url: '',
        brief: '',
        email: '',
    } as any;

    constructor() {
        this.service.friendLinks().subscribe(res => {
            this.friendLinks = res;
        });
    }

    ngOnInit() {
        this.themeService.titleChanged.next($localize `Friend Link`);
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
