import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { IShare, ITask, ITaskComment } from '../../model';
import { formatHour } from '../../../../theme/utils';
import { TaskService } from '../../task.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-share-detail',
    templateUrl: './share-detail.component.html',
    styleUrls: ['./share-detail.component.scss'],
})
export class ShareDetailComponent implements OnInit {
    private readonly service = inject(TaskService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);


    public readonly data = signal<ITask>(null);
    public share: IShare;
    public readonly items = signal<ITask[]>([]);

    public readonly panelOpen = signal(false);

    public readonly commentItems = signal<ITaskComment[]>([]);
    public readonly commentForm = form(signal({
        content: ''
    }));
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = signal({
        page: 1,
        per_page: 20
    });

    public readonly userForm = form(signal({
        keywords: ''
    }));
    public userItems: any[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.share(params.id).subscribe(res => {
                this.data.set(res.task);
                this.share = res;
                if (res.task && res.task.children) {
                    this.items.set(res.task.children);
                }
                this.tapRefresh();
                this.tapRefreshUser();
            });
        });
    }

    public readonly timeLength = computed(() => {
        return formatHour(this.data()?.time_length);
    })

    public readonly userFilterItems = computed(() => {
        const keywords = this.userForm.keywords().value();
        if (!keywords || keywords.trim().length < 1) {
            return this.userItems;
        }
        return this.userItems.filter(item => item.name.indexOf(keywords) >= 0);
    });

    public tapPage() {
        this.goPage(this.queries().page);
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries().page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.commentList({
            ...this.queries(),
            page,
            task_id: this.data().id
        }).subscribe({
            next: res => {
                this.commentItems.set(res.data);
                this.hasMore = res.paging.more;
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.queries.update(v => {
                    v.page = page;
                    return v;
                });
            },
            error: () => {
                this.isLoading.set(false);
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
        const comment = this.commentForm.content().value();
        if (!comment) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.commenSave({
            task_id: this.data().id,
            content: comment
        }).subscribe(_ => {
            this.commentForm.content().value.set('');
            this.toastrService.success('评论成功');
            this.tapRefresh();
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        form.append('task_id', this.data().id.toString());
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
        this.toastrService.confirm('确定要删除用户《' + item.name + '》?', () => {
            this.service.shareRemoveUser(this.share.id, item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.userItems = this.userItems.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
