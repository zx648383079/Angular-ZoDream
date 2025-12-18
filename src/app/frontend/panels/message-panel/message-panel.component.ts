import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { IFeedback } from '../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-message-panel',
    templateUrl: './message-panel.component.html',
    styleUrls: ['./message-panel.component.scss']
})
export class MessagePanelComponent {
    private readonly http = inject(HttpClient);



    public isLoading = true;
    public items: any[] = [];

    public loadData() {
        this.http.get<IPage<IFeedback>>('contact', {
            params: {
                per_page: 10
            }
        }).subscribe(res => {
            this.items = res.data;
            this.isLoading = false;
        });
    }

}
