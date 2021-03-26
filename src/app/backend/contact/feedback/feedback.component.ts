import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from '../../../theme/components';
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

    public editData: IFeedback = {} as any;

    constructor(
        private service: ContactService,
        private toastrService: ToastrService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}


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

    public tapView(modal: DialogBoxComponent, item: IFeedback) {
        this.editData = item;
        modal.openCustom(value => {
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
