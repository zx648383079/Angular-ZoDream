import { Component, OnInit } from '@angular/core';
import { ICategory, IMovie } from '../model';
import { TvService } from '../tv.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public items: IMovie[] = [];
    public categories: ICategory[] = [];

    constructor(
        private service: TvService,
    ) { }

    ngOnInit() {
    }

}
