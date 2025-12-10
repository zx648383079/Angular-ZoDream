import { Component, inject } from '@angular/core';
import { BlogService } from '../blog.service';
import { ITag } from '../../model';
import { ThemeService } from '../../../../theme/services';


@Component({
    standalone: false,
    selector: 'app-blog-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss']
})
export class TagComponent {
    private service = inject(BlogService);
    private themeService = inject(ThemeService);


    public tagItems: ITag[] = [];
    public isLoading = false;

    constructor() {
        this.themeService.titleChanged.next($localize `Tags`);
        this.isLoading = true;
        this.service.getTags().subscribe({
            next: res => {
                this.tagItems = res.map(item => {
                    item.style = 'font-size:' + (Math.sqrt(item.blog_count) + 12) + 'px';
                    return item;
                });
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
