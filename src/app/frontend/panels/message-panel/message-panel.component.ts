import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
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

    public readonly isLoading = signal(true);
    public readonly items = signal<any[]>([]);

    constructor() {
        this.http.get<IPage<IFeedback>>('contact', {
            params: {
                per_page: 10
            }
        }).subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

}
