import { Component, inject, signal } from '@angular/core';
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
    private readonly service = inject(BlogService);
    private readonly themeService = inject(ThemeService);


    public tagItems: ITag[] = [];
    public readonly isLoading = signal(false);

    constructor() {
        this.themeService.titleChanged.next($localize `Tags`);
        this.isLoading.set(true);
        this.service.getTags().subscribe({
            next: res => {
                this.tagItems = res.map(item => {
                    item.style = 'font-size:' + (Math.sqrt(item.blog_count) + 12) + 'px';
                    return item;
                });
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
