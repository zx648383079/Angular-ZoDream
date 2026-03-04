import { Component, inject, signal } from '@angular/core';
import { FrontendService } from '../frontend.service';
import { ILink } from '../../theme/models/seo';
import { DialogEvent, DialogService } from '../../components/dialog';
import { ThemeService } from '../../theme/services';
import { form, pattern, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-friend-link',
    templateUrl: './friend-link.component.html',
    styleUrls: ['./friend-link.component.scss']
})
export class FriendLinkComponent {
    private readonly service = inject(FrontendService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public readonly items = signal<ILink[]>([]);
    public readonly editForm = form(signal({
        name: '',
        url: '',
        brief: '',
        email: '',
    }), schemaPath => {
        required(schemaPath.name, {message: $localize `Your Site Name is required`});
        required(schemaPath.url, {message: $localize `Your Site Link is required`});
        pattern(schemaPath.url, /^https?:\/\/.+\./, {
            message: 'Link start with http[s]://',
        });
    });

    constructor() {
        this.themeService.titleChanged.next($localize `Friend Link`);
        this.service.friendLinks().subscribe(res => {
            this.items.set(res);
        });
    }

    public openApply(modal: DialogEvent) {
        modal.open(() => {
            this.service.linkApply(this.editForm().value()).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Submitted successfully, waiting for the administrator to process`);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

}
