import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IMusic } from '../../../theme/models/video';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {

  public items: IMusic[] = [];

  public hasMore = true;
  public page = 1;
  public perPage = 20;
  public isLoading = false;
  public total = 0;
  public keywords = '';

  constructor(
    private service: VideoService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.tapRefresh();
  }

  public tapPlay(item: IMusic) {
    if (!item.path) {
      this.toastrService.warning('文件不存在');
      return;
    }
    window.open(item.path, '_blank');
  }

  public get pageTotal(): number {
    return Math.ceil(this.total / this.perPage);
  }

  /**
   * tapRefresh
   */
  public tapRefresh() {
    this.goPage(1);
  }

  public tapPage() {
    this.goPage(this.page);
  }

  public tapMore() {
    this.goPage(this.page + 1);
  }

  /**
   * goPage
   */
  public goPage(page: number) {
    if (this.isLoading) {
        return;
    }
    this.isLoading = true;
    this.service.musicList({
      keywords: this.keywords,
      page,
      per_page: this.perPage
    }).subscribe(res => {
        this.isLoading = false;
        this.items = res.data;
        this.hasMore = res.paging.more;
        this.total = res.paging.total;
    });
  }

  public tapSearch(form: any) {
    this.keywords = form.keywords;
    this.tapRefresh();
  }

  public tapRemove(item: IMusic) {
    if (!confirm('确定删除“' + item.name + '”背景音乐？')) {
      return;
    }
    this.service.musicRemove(item.id).subscribe(res => {
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
