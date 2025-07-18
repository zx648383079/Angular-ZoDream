import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { IArchives } from '../../model';
import { ThemeService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-archives',
    templateUrl: './archives.component.html',
    styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {

    public items: IArchives[] = [];
    public isLoading = false;

    constructor(
        private service: BlogService,
        private themeService: ThemeService,
        ) {
        this.themeService.titleChanged.next($localize `Archives`);
        this.service.getArchives().subscribe(res => {
            this.items = res;
        });
    }

    ngOnInit() {
    }

}
