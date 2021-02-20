import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
    private toastrService: ToastrService,
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

  public tapRemove(item: ITag) {
    if (!confirm('确定删除“' + item.name + '”标签？')) {
      return;
    }
    this.service.tagRemove(item.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.items = this.items.filter(it => {
        return it.id !== item.id;
      });
    });
  }

}
