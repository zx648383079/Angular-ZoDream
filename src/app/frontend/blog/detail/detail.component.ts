import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlog, IComment } from 'src/app/theme/models/blog';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public content: SafeHtml;

  public data: IBlog;

  public commentItems: IComment[] = [];
  public page = 1;
  public hasMore = true;
  public isLoading = false;
  public total = 0;
  public perPage = 20;

  constructor(
    private sanitizer: DomSanitizer,
    private service: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(param => {
      if (!param.id) {
        this.router.navigate(['../']);
        return;
      }
      this.loadBlog(param.id);
    });
  }

  loadBlog(id: number) {
    this.service.getDetail(id).subscribe(res => {
      this.data = res;
      this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
      this.tapRefresh();
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
    this.service.commentList({
      blog_id: this.data.id,
      page
    }).subscribe(res => {
      this.page = page;
      this.hasMore = res.paging.more;
      this.isLoading = false;
      this.commentItems = res.data;
      this.total = res.paging.total;
      this.perPage = res.paging.limit;
    }, () => {
      this.isLoading = false;
    });
  }

}
