import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { IBlog } from '../../../modules/blog/model';

@Component({
    standalone: false,
  selector: 'app-article-panel',
  templateUrl: './article-panel.component.html',
  styleUrls: ['./article-panel.component.scss']
})
export class ArticlePanelComponent {
    private http = inject(HttpClient);


    public isLoading = true;
    public items: any[] = [];

    public loadData() {
        this.http.get<IPage<IBlog>>('blog', {
            params: {
                per_page: 10
            }
        }).subscribe(res => {
            this.items = res.data;
            this.isLoading = false;
        });
    }
}
