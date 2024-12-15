import { Component, OnInit } from '@angular/core';
import { VisualService } from './visual.service';

@Component({
    standalone: false,
    selector: 'app-visual-backend',
    templateUrl: './visual-backend.component.html',
    styleUrls: ['./visual-backend.component.scss']
})
export class VisualBackendComponent implements OnInit {

    public isLoading = false;
    public data: any = {};

    constructor(
        private service: VisualService
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
