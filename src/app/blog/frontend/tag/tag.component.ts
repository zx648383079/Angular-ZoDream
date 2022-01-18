import { Component } from '@angular/core';
import { BlogService } from '../blog.service';
import { ITag } from '../../../theme/models/blog';
import { ThemeService } from '../../../theme/services';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {

    public tagItems: ITag[] = [];
    public isLoading = false;

    constructor(
        private service: BlogService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Tags`);
        this.isLoading = true;
        this.service.getTags().subscribe({
            next: res => {
                this.tagItems = res.map(item => {
                    item.style = 'font-size:' + (Math.sqrt(item.blog_count) + 12) + 'px';
                    return item;
                });
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

}
