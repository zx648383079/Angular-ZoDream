import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IArticle, IArticleCategory } from '../../../../theme/models/shop';
import { ShopService } from '../../../shop.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

    public data: IArticle;
    public content: SafeHtml;

    constructor(
        private service: ShopService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.loadArticle(params.id);
        });
    }

    public loadArticle(id: any) {
        this.service.article(id).subscribe(res => {
            this.data = res;
            this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
        });
    }
}
