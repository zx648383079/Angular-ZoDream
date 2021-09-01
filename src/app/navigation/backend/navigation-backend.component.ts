import { Component, OnInit } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-navigation-backend',
  templateUrl: './navigation-backend.component.html',
  styleUrls: ['./navigation-backend.component.scss']
})
export class NavigationBackendComponent implements OnInit {

    public isLoading = true;
    public data: any = {};

    constructor(
        private service: NavigationService,
    ) { }

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
