import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { ITag } from 'src/app/theme/models/blog';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  public tags: ITag[] = [];

  public title = '标签';

  constructor(
    private service: BlogService
  ) {
    this.service.getTags().subscribe(res => {
      this.tags = res.map(item => {
        item.style = 'font-size:' + (Math.sqrt(item.count)  + 12) + 'px';
        return item;
      });
    });
  }

  ngOnInit() {
  }

}
