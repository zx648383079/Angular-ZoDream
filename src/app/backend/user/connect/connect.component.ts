import { Component, inject, signal } from '@angular/core';
import { IConnect } from '../../../theme/models/auth';
import { UserService } from '../user.service';

@Component({
    standalone: false,
    selector: 'app-b-connect',
    templateUrl: './connect.component.html',
    styleUrls: ['./connect.component.scss']
})
export class ConnectComponent {
    private readonly service = inject(UserService);


    public readonly items = signal<IConnect[]>([]);

    constructor() {
        this.tapRefresh();
    }

    public tapRefresh() {
        this.service.connect().subscribe(res => {
            this.items.set(res);
        });
    }
}
