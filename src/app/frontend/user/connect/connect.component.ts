import { Component, OnInit } from '@angular/core';
import { IConnect } from '../../../theme/models/auth';
import { UserService } from '../user.service';
import { WebAuthn } from '../../../theme/services';
import { DialogService } from '../../../components/dialog';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

    public items: IConnect[] = [];

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
            this.items = res.map(i => {
                i.icon = this.converterIcon(i.icon);
                return i;
            });
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
    }

    public tapUnbind(item: IConnect) {
        this.toastrService.confirm($localize `Are you sure to unbinding this account?`, () => {

        });
    }


    private converterIcon(icon: string): string {
        if (!icon) {
            return '';
        }
        const map = {
        };
        return Object.prototype.hasOwnProperty.call(map, icon) ? map[icon] : icon.replace('fa-', 'icon-');
    }



}
