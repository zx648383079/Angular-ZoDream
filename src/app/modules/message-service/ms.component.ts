import { Component, OnInit } from '@angular/core';
import { MessageServiceService } from './ms.service';

@Component({
    selector: 'app-message-service',
    templateUrl: './ms.component.html',
    styleUrls: ['./ms.component.scss']
})
export class MessageServiceComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: MessageServiceService,
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
