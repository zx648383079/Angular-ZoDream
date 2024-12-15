import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../components/dialog';
import { IConnect } from '../../../../theme/models/auth';
import { WebAuthn } from '../../../../theme/services';
import { emptyValidate } from '../../../../theme/validators';
import { MemberService } from '../member.service';

@Component({
    standalone: false,
    selector: 'app-member-connect',
    templateUrl: './connect.component.html',
    styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

    @ViewChild('faModal')
    private faModal: DialogEvent;
    public items: IConnect[] = [];
    public isLoading = false;
    public data = {
        recovery_code: '',
        twofa_code: '',
        qr: '',
    };

    constructor(
        private service: MemberService,
        private toastrService: DialogService,
        private webAuthnn: WebAuthn
    ) { }

    ngOnInit() {
        this.tapRefresh();
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
                this.data.recovery_code = res.recovery_code;
                this.data.qr = res.qr;
                this.faModal.open(() => {
                    this.service.save2FA({
                        twofa_code: this.data.twofa_code
                    }).subscribe({
                        next: _ => {
                            this.toastrService.success($localize `Open successfully`);
                            this.tapRefresh();
                        },
                        error: err => {
                            this.toastrService.error(err);
                        }
                    });
                }, () => !emptyValidate(this.data.twofa_code));
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

}
