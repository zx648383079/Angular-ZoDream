import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog';
import { PanelAnimation } from '../../../theme/constants/panel-animation';
import { IShare, ITask, ITaskComment } from '../../model';
import { formatHour } from '../../../theme/utils';
import { TaskService } from '../../task.service';

@Component({
    selector: 'app-share-detail',
    templateUrl: './share-detail.component.html',
    styleUrls: ['./share-detail.component.scss'],
    animations: [
        PanelAnimation,
    ]
})
export class ShareDetailComponent implements OnInit {

    public data: ITask;
    public share: IShare;
    public items: ITask[] = [];

    public panelOpen = false;

    public commentItems: ITaskComment[] = [];
    public comment = '';
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public perPage = 20;

    public userKeywords = '';
    public userItems: any[] = [];

    constructor(
        private service: TaskService,
        private toastrService: DialogService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.share(params.id).subscribe(res => {
                this.data = res.task;
                this.share = res;
                if (res.task && res.task.children) {
                    this.items = res.task.children;
                }
                this.tapRefresh();
                this.tapRefreshUser();
            });
        });
    }

    get timeLength() {
        return formatHour(this.data?.time_length);
    }

    get userFilterItems() {
        if (!this.userKeywords || this.userKeywords.trim().length < 1) {
            return this.userItems;
        }
        return this.userItems.filter(item => item.name.indexOf(this.userKeywords) >= 0);
    }

    public tapPage() {
        this.goPage(this.page);
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
        this.service.commentList({
            page,
            task_id: this.data.id
        }).subscribe({
            next: res => {
                this.commentItems = res.data;
                this.page = page;
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.perPage = res.paging.limit;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public commentEnter(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapComment();
    }

    public tapComment() {
        if (!this.comment) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.commenSave({
            task_id: this.data.id,
            content: this.comment
        }).subscribe(_ => {
            this.comment = '';
            this.toastrService.success('评论成功');
            this.tapRefresh();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        form.append('task_id', this.data.id.toString());
        form.append('file', files[0], files[0].name);
        this.service.commenSave(form).subscribe(_ => {
            this.toastrService.success('评论成功');
            this.tapRefresh();
        });
    }

    public tapRefreshUser() {
        this.service.shareUsers({
            id: this.share.id
        }).subscribe(res => {
            this.userItems = res.data;
        });
    }

    public tapRemoveUser(item: any) {
        if (!confirm('确定要删除用户《' + item.name + '》?')) {
            return;
        }
        this.service.shareRemoveUser(this.share.id, item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.userItems = this.userItems.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
