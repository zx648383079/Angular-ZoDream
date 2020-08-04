import { Component, OnInit } from '@angular/core';
import { ITag } from '../../../theme/models/blog';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  public items: ITag[] = [];

  public isLoading = false;

  constructor(
    private service: BlogService,
  ) {
    this.tapRefresh();
  }

  ngOnInit() {}

  /**
   * tapRefresh
   */
  public tapRefresh() {
    if (this.isLoading) {
        return;
    }
    this.isLoading = true;
    this.service.getTags().subscribe(res => {
        this.isLoading = false;
        this.items = res;
    });
  }

}
