import { Component, OnInit } from '@angular/core';
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

    constructor(
        private service: BlogService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Tags`);
        this.service.getTags().subscribe(res => {
            this.tagItems = res.map(item => {
                item.style = 'font-size:' + (Math.sqrt(item.count)  + 12) + 'px';
                return item;
            });
        });
    }

}
