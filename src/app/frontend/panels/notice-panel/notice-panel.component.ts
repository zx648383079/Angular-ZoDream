import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
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
    private http = inject(HttpClient);
    private sanitizer = inject(DomSanitizer);


    public isLoading = true;
    public items: any[] = [];

    public loadData() {
        this.http.get<IPage<INote>>('note', {
            params: {
                notice: 1,
                per_page: 10
            }
        }).subscribe(res => {
            this.items = res.data.map(i => {
                i.html = this.sanitizer.bypassSecurityTrustHtml(i.html);
                return i;
            });
            this.isLoading = false;
        });
    }
}
