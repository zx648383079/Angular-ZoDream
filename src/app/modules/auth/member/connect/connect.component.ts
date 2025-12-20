import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IConnect } from '../../../../theme/models/auth';
import { WebAuthn } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import { MemberService } from '../member.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-member-connect',
    templateUrl: './connect.component.html',
    styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
    private readonly service = inject(MemberService);
    private readonly toastrService = inject(DialogService);
    private webAuthnn = inject(WebAuthn);


    private readonly faModal = viewChild<DialogEvent>('faModal');
    public items: IConnect[] = [];
    public isLoading = false;
    public readonly dataForm = form(signal({
        recovery_code: '',
        twofa_code: '',
        qr: '',
    }));

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        history.back();
    }

    public tapRefresh() {
        this.isLoading = true;
        this.service.connect().subscribe({
            next: res => {
                this.items = res;
                this.isLoading = false;
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapBind(item: IConnect) {
        if (item.vendor === 'web_authn') {
            this.webAuthnn.create().subscribe({
                next: _ => {
                    this.tapRefresh();
                    this.toastrService.success($localize `WeAuthn register successfully`);
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
            return;
        }
        if (item.vendor === '2fa') {
            this.create2FA();
            return;
        }
    }

    public tapUnbind(item: IConnect) {
        this.toastrService.confirm($localize `Are you sure to unbinding this account?`, () => {
            this.service.connectRemove(item.id).subscribe(_ => {
                this.toastrService.success($localize `Unbind successfully`);
                this.tapRefresh();
            });
        });
    }

    private create2FA() {
        this.service.create2FA().subscribe({
            next: res => {
                this.dataForm().value.update(v => {
                    v.recovery_code = res.recovery_code;
                    v.qr = res.qr;
                    return v;
                });
                
                this.faModal().open(() => {
                    this.service.save2FA({
                        twofa_code: this.dataForm.twofa_code().value()
                    }).subscribe({
                        next: _ => {
                            this.toastrService.success($localize `Open successfully`);
                            this.tapRefresh();
                        },
                        error: err => {
                            this.toastrService.error(err);
                        }
                    });
                }, () => !emptyValidate(this.dataForm.twofa_code().value()));
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
