import { Component, OnInit, inject, signal } from '@angular/core';
import { IConnect } from '../../../../../theme/models/auth';
import { ShopService } from '../../../shop.service';

@Component({
    standalone: false,
    selector: 'app-account-center',
    templateUrl: './account-center.component.html',
    styleUrls: ['./account-center.component.scss']
})
export class AccountCenterComponent implements OnInit {
    private readonly service = inject(ShopService);

    public title = '安全中心';
    public readonly items = signal<IConnect[]>([]);

    ngOnInit() {
        this.service.connect().subscribe(res => {
            this.items.set(res.data.map(i => {
                i.icon = this.converterIcon(i.icon);
                return i;
            }));
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
