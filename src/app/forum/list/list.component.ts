import { Component, OnInit } from '@angular/core';
import { IForum, IThread } from '../../theme/models/forum';
import { ForumService } from '../forum.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public forum: IForum;

  public items: IThread[] = [];

  public page = 1;
  public hasMore = true;
  public isLoading = false;

  constructor(
    private service: ForumService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.getForum(params.id).subscribe(res => {
        this.forum = res;
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
    this.service.getThreadList({
      forum: this.forum.id,
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
