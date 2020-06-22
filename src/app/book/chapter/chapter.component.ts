import { Component, OnInit } from '@angular/core';
import { IChapter } from 'src/app/theme/models/book';
import { BookService } from '../book.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

  public items: IChapter[] = [];
  public isSort = false;
  public activeChapter = 0;

  constructor(
    private service: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      const bookId = parseInt(res.book, 10);
      if (!bookId) {
          return;
      }
      // dispatchChapters(bookId).then(res => {
      //     this.items = res;
      // });
      // const record = BookRecord.getItem(bookId);
      // if (record) {
      //     this.activeChapter = record.chapter_id;
      // }
    });
  }


  public tapChapter(item: IChapter) {
      this.router.navigateByUrl('./reader/' + item.id);
  }
  public tapSort() {
      this.isSort = !this.isSort;
      if (this.items) {
          this.items.reverse();
      }
  }

}
