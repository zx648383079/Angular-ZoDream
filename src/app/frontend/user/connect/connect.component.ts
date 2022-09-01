import { Component, OnInit } from '@angular/core';
import { IConnect } from '../../../theme/models/auth';
import { UserService } from '../user.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

    public items: IConnect[] = [];

    constructor(
        private service: UserService,
    ) { }

    ngOnInit() {
        this.service.connect().subscribe(res => {
            this.items = res.map(i => {
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
