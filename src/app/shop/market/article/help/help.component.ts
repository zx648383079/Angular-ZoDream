import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IArticle } from '../../../../theme/models/shop';
import { ShopService } from '../../../shop.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

    public items = [];

    public data: IArticle;

    public content: SafeHtml;

    constructor(
        private service: ShopService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.service.help().subscribe(res => {
            this.items = res.data;
        });
    }

    public loadArticle(id: any) {
        this.service.article(id).subscribe(res => {
            this.data = res;
            this.content = this.sanitizer.bypassSecurityTrustHtml(res.content);
        });
    }

    public tapItem(item: any) {
        if (item.children) {
            item.expand = true;
            this.tapItem(item.children[0]);
            return;
        }
        this.items = this.items.map(i => {
            if (i.children) {
                i.children = i.children.map(it => {
                    it.active = it === item;
                    return it;
                });
            } else {
                i.active = i === item;
            }
            return i;
        });
        this.loadArticle(item.id);
    }

}
