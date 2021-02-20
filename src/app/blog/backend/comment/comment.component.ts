import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IComment } from '../../../theme/models/blog';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  public items: IComment[] = [];
  public page = 1;
  public hasMore = true;
  public isLoading = false;
  public total = 0;
  public perPage = 20;
  public keywords = '';

  constructor(
    private service: BlogService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit() {
    this.tapRefresh();
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
    this.service.getComment({
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

  public tapPage() {
    this.goPage(this.page);
  }

  public tapSearch(form: any) {
    this.keywords = form.keywords;
    this.tapRefresh();
  }

  public tapRemove(item: IComment) {
    if (!confirm('确定删除“' + item.content + '”评论？')) {
      return;
    }
    this.service.commentRemove(item.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.items = this.items.filter(it => {
        return it.id !== item.id;
      });
    });
  }

}
