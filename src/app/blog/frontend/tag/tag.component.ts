import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { ITag } from '../../../theme/models/blog';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {

    public tagItems: ITag[] = [];

    public title = '标签';

    constructor(
        private service: BlogService
    ) {
        this.service.getTags().subscribe(res => {
            this.tagItems = res.map(item => {
                item.style = 'font-size:' + (Math.sqrt(item.count)  + 12) + 'px';
                return item;
            });
        });
    }

}
