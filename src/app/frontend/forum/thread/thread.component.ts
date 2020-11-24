import { Component, OnInit } from '@angular/core';
import { IThread } from 'src/app/theme/models/forum';
import { ForumService } from '../forum.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

  public thread: IThread;
  public items = [];

  public page = 1;
  public hasMore = true;
  public isLoading = false;

  constructor(
    private service: ForumService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getThread(params.id).subscribe(res => {
        this.thread = res;
        this.tapRefresh();
      });
    });
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
    this.service.getPostList({
      thread: this.thread.id,
      page
    }).subscribe(res => {
      this.page = page;
      this.hasMore = res.paging.more;
      this.isLoading = false;
      this.items = page < 2 ? res.data : [].concat(this.items, res.data);
    }, () => {
      this.isLoading = false;
    });
  }

}
