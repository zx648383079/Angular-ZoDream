import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { IPage } from '../../../theme/models/page';
import { INote } from '../../../modules/note/model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    standalone: false,
    selector: 'app-notice-panel',
    templateUrl: './notice-panel.component.html',
    styleUrls: ['./notice-panel.component.scss']
})
export class NoticePanelComponent {
    private readonly http = inject(HttpClient);
    private readonly sanitizer = inject(DomSanitizer);


    public readonly isLoading = signal(true);
    public readonly items = signal<any[]>([]);

    constructor() {
        this.http.get<IPage<INote>>('note', {
            params: {
                notice: 1,
                per_page: 10
            }
        }).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data.map(i => {
                    i.html = this.sanitizer.bypassSecurityTrustHtml(i.html);
                    return i;
                }));
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }
}
