import { Component, OnInit, inject } from '@angular/core';
import { MicroService } from './micro.service';

@Component({
    standalone: false,
  selector: 'app-micro',
  templateUrl: './micro.component.html',
  styleUrls: ['./micro.component.scss']
})
export class MicroComponent implements OnInit {
    private service = inject(MicroService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
