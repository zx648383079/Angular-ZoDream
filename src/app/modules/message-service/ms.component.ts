import { Component, OnInit, inject } from '@angular/core';
import { MessageServiceService } from './ms.service';

@Component({
    standalone: false,
    selector: 'app-message-service',
    templateUrl: './ms.component.html',
    styleUrls: ['./ms.component.scss']
})
export class MessageServiceComponent implements OnInit {
    private service = inject(MessageServiceService);


    public isLoading = true;
    public data: any = {};

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
