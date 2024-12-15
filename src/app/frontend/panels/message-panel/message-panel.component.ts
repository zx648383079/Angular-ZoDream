import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { IFeedback } from '../../../theme/models/seo';

@Component({
    standalone: false,
    selector: 'app-message-panel',
    templateUrl: './message-panel.component.html',
    styleUrls: ['./message-panel.component.scss']
})
export class MessagePanelComponent {


    public isLoading = true;
    public items: any[] = [];

    constructor(
        private http: HttpClient,
    ) { }

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
