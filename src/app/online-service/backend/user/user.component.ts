import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../theme/models/user';
import { ICategoryUser } from '../../model';
import { OnlineBackendService } from '../online.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    public items: ICategoryUser[] = [];
    public hasMore = true;
    public page = 1;
    public perPage = 20;
    public isLoading = false;
    public total = 0;
    public keywords = '';
    public category = 0;
    public users: IUser[] = [];

    constructor(
        private service: OnlineBackendService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.category) {
                this.category = parseInt(params.category, 10);
            }
            this.tapRefresh();
        });
    }

    public get pageTotal(): number {
        return Math.ceil(this.total / this.perPage);
    }

    public open(content: any) {
        this.users = [];
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
            if (this.users.length < 0) {
                return;
            }
            this.service.userAdd({
                category: this.category,
                user: this.users.map(i => i.id)
            }).subscribe(_ => {
                this.toastrService.success('添加客服成功');
                this.tapPage();
            });
        });
    }

    public tapSearch(form: any) {
        this.keywords = form.keywords || '';
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.page);
    }

    public tapMore() {
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.userList({
            category: this.category,
            page,
            per_page: this.perPage
        }).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
        });
    }

    public tapRemove(item: ICategoryUser) {
        if (!confirm('确定删除“' + item.user.name + '”客服人员？')) {
            return;
        }
        this.service.userRemove({
            user: item.user_id,
            category: item.cat_id,
        }).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.tapPage();
        });
    }

}
