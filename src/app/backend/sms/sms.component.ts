import { Component, OnInit } from '@angular/core';
import { SmsService } from './sms.service';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: SmsService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe({
            next: res => {
                this.data = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
