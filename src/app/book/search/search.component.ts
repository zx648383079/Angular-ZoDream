import { Component, OnInit } from '@angular/core';
import { IBook } from 'src/app/theme/models/book';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public items: IBook[] = [];

  constructor() { }

  ngOnInit() {
  }

  public tapBook(item: IBook) {
    
  }

}
