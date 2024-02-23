import { Component, OnInit, ViewChild } from '@angular/core';
import { IConnect } from '../../../theme/models/auth';
import { UserService } from '../user.service';
import { WebAuthn } from '../../../theme/services';
import { DialogEvent, DialogService } from '../../../components/dialog';
import { emptyValidate } from '../../../theme/validators';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

    @ViewChild('faModal')
    private faModal: DialogEvent;
    public items: IConnect[] = [];
    public data = {
        recovery_code: '',
        twofa_code: '',
        qr: '',
    };

    constructor(
        private service: UserService,
        private toastrService: DialogService,
        private webAuthnn: WebAuthn
    ) { }

    ngOnInit() {
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.connect().subscribe(res => {
            this.items = res;
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
