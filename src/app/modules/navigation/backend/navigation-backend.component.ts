import { Component, OnInit, inject } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
    standalone: false,
  selector: 'app-navigation-backend',
  templateUrl: './navigation-backend.component.html',
  styleUrls: ['./navigation-backend.component.scss']
})
export class NavigationBackendComponent implements OnInit {
    private service = inject(NavigationService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
