import { Component, OnInit, inject, signal } from '@angular/core';
import { BlogService } from '../blog.service';
import { IArchives } from '../../model';
import { ThemeService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-archives',
    templateUrl: './archives.component.html',
    styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent {
    private readonly service = inject(BlogService);
    private readonly themeService = inject(ThemeService);


    public readonly items = signal<IArchives[]>([]);
    public readonly isLoading = signal(false);

    constructor() {
        this.themeService.titleChanged.next($localize `Archives`);
        this.service.getArchives().subscribe(res => {
            this.items.set(res);
        });
    }

}
