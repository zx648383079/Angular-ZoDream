import { Component, OnInit } from '@angular/core';
import { ICategory, IMovie } from '../model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public items: IMovie[] = [];
    public categories: ICategory[] = [];

    constructor() { }

    ngOnInit() {
    }

}
