import { Component, OnInit, inject } from '@angular/core';
import { MemberService } from '../member.service';

@Component({
    standalone: false,
    selector: 'app-member-driver',
    templateUrl: './driver.component.html',
    styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {
    private readonly service = inject(MemberService);


    public items: any[] = [];
    public isLoading = false;

    ngOnInit() {
        this.tapRefresh();
    }

    public tapBack() {
        history.back();
    }

    public tapRefresh() {
        this.isLoading = true;
        this.service.driverList().subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: _ => {
                this.isLoading = false;
            }
        });
    }

}
