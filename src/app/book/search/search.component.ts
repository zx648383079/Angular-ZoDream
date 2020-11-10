import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBook } from 'src/app/theme/models/book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public items: IBook[] = [];
  public page = 1;
  public hasMore = true;
  public isLoading = false;
  public total = 0;
  public perPage = 20;

  constructor(
    private service: BookService,
    private router: Router
) {}

  ngOnInit() {
    this.tapRefresh();
  }

  public tapBook(item: IBook) {
    
  }

  public tapRefresh() {
    this.goPage(1);
}

public tapMore() {
    if (!this.hasMore) {
        return;
    }
    this.goPage(this.page + 1);
}

public goPage(page: number) {
    if (this.isLoading) {
        return;
    }
    this.isLoading = true;
    this.service.getBookList({
        page
    }).subscribe(res => {
        this.page = page;
        this.hasMore = res.paging.more;
        this.isLoading = false;
        this.items = res.data;
        this.total = res.paging.total;
        this.perPage = res.paging.limit;
    }, () => {
        this.isLoading = false;
    });
}

}
