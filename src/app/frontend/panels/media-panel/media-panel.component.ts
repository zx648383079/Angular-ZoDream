import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { IResource } from '../../../modules/resource-store/model';

@Component({
    standalone: false,
    selector: 'app-media-panel',
    templateUrl: './media-panel.component.html',
    styleUrls: ['./media-panel.component.scss']
})
export class MediaPanelComponent {

    public isLoading = true;
    public items: any[] = [];

    constructor(
        private http: HttpClient,
    ) { }

    public loadData() {
        this.http.get<IPage<IResource>>('res', {
            params: {
                per_page: 10
            }
        }).subscribe(res => {
            this.items = res.data;
            this.isLoading = false;
        });
    }
}
