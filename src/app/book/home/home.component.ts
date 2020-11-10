import { Component, OnInit } from '@angular/core';
import { IBook, IBookRecord } from '../../../app/theme/models/book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public items: IBookRecord[] = [];

  constructor(
    private service: BookService,
  ) { }

  ngOnInit() {
  }

}
