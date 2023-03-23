import { Component, OnInit } from '@angular/core';
import { IThemeComponent } from '../../model';
import { VisualService } from '../visual.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public pageItems: IThemeComponent[] = [];
    public weightItems: IThemeComponent[] = [];

    constructor(
        private service: VisualService
    ) { }

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
