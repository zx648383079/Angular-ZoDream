import { Component, OnInit, inject } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private service = inject(BackendService);


    public isLoading = true;
    public data: any = {};
    public debugKey = '';

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

    public onKey(e: KeyboardEvent) {
        this.debugKey = e.key;
    }
}
