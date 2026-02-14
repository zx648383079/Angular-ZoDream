import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { MemberService } from '../member.service';

@Component({
    standalone: false,
    selector: 'app-member-driver',
    templateUrl: './driver.component.html',
    styleUrls: ['./driver.component.scss']
})
export class DriverComponent {
    private readonly service = inject(MemberService);
    private readonly location = inject(Location);

    public readonly items = signal<any[]>([]);
    public readonly isLoading = signal(false);

    constructor() {
        this.tapRefresh();
    }

    public tapBack() {
        this.location.back();
    }

    public tapRefresh() {
        this.isLoading.set(true);
        this.service.driverList().subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

}
