import { AfterViewInit, Component } from '@angular/core';
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
export class CancelAccountComponent implements AfterViewInit {

    public items: string[] = [
        $localize `Need to unbundle of phone`,
        $localize `Need to unbundle of email`,
        $localize `Security/Privacy Concerns`,
        $localize `It's a redundant account`,
    ];
    public selectedIndex = 0;

    constructor(
        private authService: AuthService,
        private router: Router,
        private service: MemberService,
        private toastrService: DialogService,
    ) { }

    ngAfterViewInit(): void {
        this.toastrService.confirm({
            content: $localize `After account cancellation, your account and account data will be deleted and your completed transactions will not be available for sale.`, 
            title: $localize `Account Cancellation Confirmation`, 
            confirmText: $localize `Continuing cancel`,
            cancelText: $localize `hold off cancel`,
            onCancel() {
                history.back();
            },
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        this.toastrService.confirm($localize `Confirming account cancellation? You can't log in again after submitting!`, () => {
            e?.enter();
            this.service.cancelAccount({
                reason: this.items[this.selectedIndex],
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
