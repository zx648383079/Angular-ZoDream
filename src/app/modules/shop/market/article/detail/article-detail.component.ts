import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IArticle, IArticleCategory } from '../../../model';
import { ShopService } from '../../../shop.service';

@Component({
    standalone: false,
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent {
    private readonly service = inject(ShopService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);


    public readonly data = signal<IArticle>(null);
    public readonly content = signal<SafeHtml>(null);

    constructor() {
        this.route.params.subscribe(params => {
            this.loadArticle(params.id);
        });
    }

    public loadArticle(id: any) {
        this.service.article(id).subscribe(res => {
            this.data.set(res);
            this.content.set(this.sanitizer.bypassSecurityTrustHtml(res.content));
        });
    }
}
