import { Component, OnInit, inject, signal } from '@angular/core';
import { FrontendService } from '../frontend.service';
import { IFriendLink, ILink } from '../../theme/models/seo';
import { DialogService } from '../../components/dialog';
import { DialogBoxComponent } from '../../components/dialog';
import { ThemeService } from '../../theme/services';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-friend-link',
    templateUrl: './friend-link.component.html',
    styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent implements OnInit {
    private readonly service = inject(FrontendService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public friendLinks: ILink[] = [];
    public readonly editForm = form(signal({
        name: '',
        url: '',
        brief: '',
        email: '',
    }), schemaPath => {
        required(schemaPath.name);
        required(schemaPath.url);
    });

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
            this.service.linkApply(this.editForm).subscribe(_ => {
                this.toastrService.success($localize `Submitted successfully, waiting for the administrator to process`);
            });
        }, () => this.editForm().valid());
    }

}
