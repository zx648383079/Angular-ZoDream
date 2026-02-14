import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { MemberService } from '../member.service';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { AuthService } from '../../../../theme/services';
import { Router } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-member-cancel-account',
    templateUrl: './cancel-account.component.html',
    styleUrls: ['./cancel-account.component.scss']
})
export class CancelAccountComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly service = inject(MemberService);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public items: string[] = [
        $localize `Need to unbundle of phone`,
        $localize `Need to unbundle of email`,
        $localize `Security/Privacy Concerns`,
        $localize `It's a redundant account`,
    ];
    public readonly selectedIndex = signal(0);

    constructor() {
        afterNextRender({
            write: () => {
                this.toastrService.confirm({
                    content: $localize `After account cancellation, your account and account data will be deleted and your completed transactions will not be available for sale.`, 
                    title: $localize `Account Cancellation Confirmation`, 
                    confirmText: $localize `Continuing cancel`,
                    cancelText: $localize `hold off cancel`,
                    onCancel() {
                        this.location.back();
                    },
                });
            }
        });
    }

    public tapBack() {
        this.location.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        this.toastrService.confirm($localize `Confirming account cancellation? You can't log in again after submitting!`, () => {
            e?.enter();
            this.service.cancelAccount({
                reason: this.items[this.selectedIndex()],
            }).subscribe({
                next: _ => {
                    e?.reset();
                    this.toastrService.success($localize `Your account cancellation request has been submitted and is awaiting confirmation from the administrator.`);
                    this.authService.logout().subscribe(_ => {
                        this.router.navigateByUrl('/');
                    });
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            });
        });
    }
}
