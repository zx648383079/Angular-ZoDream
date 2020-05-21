import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  public items: any[] = [1];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  constructor() {}

  ngOnInit() {}

  public get pageTotal(): number {
    return Math.ceil(this.total / this.perPage);
  }

  /**
   * tapRefresh
   */
  public tapRefresh() {
    this.tapGo(1);
  }

  public tapMore() {
    this.tapGo(this.page + 1);
  }

  /**
   * tapGo
   */
  public tapGo(page: number) {
    if (this.isLoading) {
      return;
    }
  }

}
