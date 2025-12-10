import { Component, OnInit, inject } from '@angular/core';
import { IThemeComponent } from '../../model';
import { VisualService } from '../visual.service';

@Component({
    standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private service = inject(VisualService);


    public pageItems: IThemeComponent[] = [];
    public weightItems: IThemeComponent[] = [];

    ngOnInit() {

    }

    public loadPage() {
        this.service.recommend({
            type: 0
        }).subscribe(res => {
            this.pageItems = res.data;
        });
    }

    public loadWeight() {
        this.service.recommend({
            type: 1
        }).subscribe(res => {
            this.weightItems = res.data;
        });
    }

}
