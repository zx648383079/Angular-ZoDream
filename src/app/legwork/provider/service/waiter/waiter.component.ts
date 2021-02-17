import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../../theme/models/user';
import { LegworkService } from '../../../legwork.service';
import { IService } from '../../../model';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.scss']
})
export class WaiterComponent implements OnInit {

    public items: IUser[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public keywords = '';
    public data: IService;

    constructor(
        private service: LegworkService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.loadService(params.id);
        });
    }

    private loadService(id: any) {
        this.service.providerService(id).subscribe(res => {
            this.data = res;
            this.tapRefresh();
        });
    }

    public tapChange(item: IUser, status = 1) {
        this.service.providerWaiterChange({
            id: this.data.id,
            user_id: item.id,
            status
        }).subscribe(_ => {
            this.toastrService.success('已修改');
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.providerWaiterList({
            id: this.data.id,
            keywords: this.keywords,
            page
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            this.items = page < 2 ? res.data : [].concat(this.items, res.data);
        }, () => {
            this.isLoading = false;
        });
    }

}
