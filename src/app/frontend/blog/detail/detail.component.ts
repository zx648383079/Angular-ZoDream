import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlog } from 'src/app/theme/models/blog';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public content: SafeHtml;

  public item: IBlog;

  constructor(
    private sanitizer: DomSanitizer,
    private service: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.content = this.sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnInit() {
    this.route.params.subscribe(param => {
      if (param.id) {
        this.router.navigate(['./list']);
        return;
      }
      this.loadBlog(param.id);
    });
  }

  loadBlog(id: number) {
    this.service.getDetail(id).subscribe(res => {
      this.item = res;
      this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
    });
  }

}
