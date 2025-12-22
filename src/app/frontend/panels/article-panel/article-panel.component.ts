import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { IBlog } from '../../../modules/blog/model';

@Component({
    standalone: false,
    selector: 'app-article-panel',
    templateUrl: './article-panel.component.html',
    styleUrls: ['./article-panel.component.scss']
})
export class ArticlePanelComponent {
    private readonly http = inject(HttpClient);
    public readonly items = signal<any[]>([]);
    public readonly isLoading = signal(true);

    constructor() {
        this.http.get<IPage<IBlog>>('blog', {
            params: {
                per_page: 10
            }
        }).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }
}
