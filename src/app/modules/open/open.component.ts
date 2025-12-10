import { Component, OnInit, inject } from '@angular/core';
import { OpenService } from './open.service';

@Component({
    standalone: false,
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.scss']
})
export class OpenComponent implements OnInit {
    private service = inject(OpenService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
