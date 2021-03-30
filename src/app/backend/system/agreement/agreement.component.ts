import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IAgreement } from '../../../theme/models/seo';
import { SystemService } from '../system.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {

    public items: IAgreement[] = [];

    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';

    constructor(
        private service: SystemService,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {
        this.tapRefresh();
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
        this.service.agreementList({
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

    public tapRemove(item: IAgreement) {
        if (!confirm('确定删除“' + item.title + '”协议？')) {
            return;
        }
        this.service.agreementRemove(item.id).subscribe(res => {
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
