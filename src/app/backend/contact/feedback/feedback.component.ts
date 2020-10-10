import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IFeedback } from '../../../theme/models/seo';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {

  public items: IFeedback[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public editData: IFeedback;

  constructor(
    private service: ContactService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
  ) {
    this.tapRefresh();
  }

  ngOnInit() {}

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
    this.service.feedbackList({
      page,
      per_page: this.perPage
    }).subscribe(res => {
        this.isLoading = false;
        this.items = res.data;
        this.hasMore = res.paging.more;
        this.total = res.paging.total;
    });
  }

  public tapView(content: any, item: IFeedback) {
    this.editData = item;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
      this.service.feedbackSave({
        status: value,
        id: this.editData?.id
      }).subscribe(res => {
        this.toastrService.success('保存成功');
        this.tapPage();
      });
    });
  }

  public tapRemove(item: IFeedback) {
    if (!confirm('确认删除此反馈？')) {
      return;
    }
    this.service.feedbackRemove(item.id).subscribe(res => {
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
