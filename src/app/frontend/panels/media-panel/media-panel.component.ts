import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { IResource } from '../../../modules/resource-store/model';

@Component({
    standalone: false,
    selector: 'app-media-panel',
    templateUrl: './media-panel.component.html',
    styleUrls: ['./media-panel.component.scss']
})
export class MediaPanelComponent {
    private readonly http = inject(HttpClient);


    public readonly isLoading = signal(true);
    public readonly items = signal<any[]>([]);

    public loadData() {
        this.http.get<IPage<IResource>>('res', {
            params: {
                per_page: 10
            }
        }).subscribe(res => {
            this.items.set(res.data);
            this.isLoading.set(false);
        });
    }
}
