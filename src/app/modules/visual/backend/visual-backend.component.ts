import { Component, OnInit, inject } from '@angular/core';
import { VisualService } from './visual.service';

@Component({
    standalone: false,
    selector: 'app-visual-backend',
    templateUrl: './visual-backend.component.html',
    styleUrls: ['./visual-backend.component.scss']
})
export class VisualBackendComponent implements OnInit {
    private service = inject(VisualService);


    public isLoading = false;
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
