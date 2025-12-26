import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IArticle } from '../../../model';
import { ShopService } from '../../../shop.service';

@Component({
    standalone: false,
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
    private readonly service = inject(ShopService);
    private readonly route = inject(ActivatedRoute);
    private readonly sanitizer = inject(DomSanitizer);


    public readonly items = signal<any[]>([]);
    public readonly data = signal<IArticle>(null);
    public readonly content = signal<SafeHtml>(null);

    ngOnInit() {
        this.service.help().subscribe(res => {
            this.items.set(res.data);
        });
    }

    public loadArticle(id: any) {
        this.service.article(id).subscribe(res => {
            this.data.set(res);
            this.content.set(this.sanitizer.bypassSecurityTrustHtml(res.content));
        });
    }

    public tapItem(item: any) {
        if (item.children) {
            item.expand = true;
            this.tapItem(item.children[0]);
            return;
        }
        this.items.update(v => {
            return v.map(i => {
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
        });
        this.loadArticle(item.id);
    }

}
