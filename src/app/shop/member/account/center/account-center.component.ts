import { Component, OnInit } from '@angular/core';
import { IConnect } from '../../../../theme/models/auth';
import { ShopService } from '../../../shop.service';

@Component({
  selector: 'app-account-center',
  templateUrl: './account-center.component.html',
  styleUrls: ['./account-center.component.scss']
})
export class AccountCenterComponent implements OnInit {
    public title = '安全中心';
    public items: IConnect[] = [];

    constructor(
        private service: ShopService,
    ) { }

    ngOnInit() {
        this.service.connect().subscribe(res => {
            this.items = res.data.map(i => {
                i.icon = this.converterIcon(i.icon);
                return i;
            });
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
