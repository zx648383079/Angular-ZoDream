import { Component, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { DialogService } from '../../../components/dialog';
import { IPageQueries } from '../../../theme/models/page';
import { ITaskComment } from '../model';
import { TaskService } from '../task.service';

@Component({
    standalone: false,
    selector: 'app-comment-panel',
    templateUrl: './comment-panel.component.html',
    styleUrls: ['./comment-panel.component.scss'],
})
export class CommentPanelComponent implements OnChanges {
    private service = inject(TaskService);
    private toastrService = inject(DialogService);


    public readonly itemId = input(0);
    public visible = false;
    public content = '';
    public items: ITaskComment[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };

    private booted = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.visible && changes.visible.currentValue && this.itemId() > 0 && this.booted !== this.itemId()) {
            this.boot();
        }
    }

    public open() {
        this.visible = true;
        if (this.itemId() > 0 && this.booted !== this.itemId()) {
            this.boot();
        }
    }

    
    public commentEnter(event: KeyboardEvent) {
        if (event.key !== 'Enter') {
            return;
        }
        this.tapComment();
    }

    public tapComment() {
        if (!this.content) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.commenSave({
            task_id: this.itemId(),
            content: this.content
        }).subscribe({
            next: _ => {
                this.content = '';
                this.toastrService.success('评论成功');
                this.tapRefresh();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        const form = new FormData();
        form.append('task_id', this.itemId().toString());
        form.append('file', files[0], files[0].name);
        this.service.commenSave(form).subscribe({
            next: _ => {
                this.toastrService.success('评论成功');
                this.tapRefresh();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    private boot() {
        this.booted = this.itemId();
        if (this.itemId() < 1) {
            return;
        }
        this.tapRefresh();
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.commentList({...queries, task_id: this.itemId()}).subscribe({
            next: res => {
                this.hasMore = res.paging.more;
                this.isLoading = false;
                this.total = res.paging.total;
                this.items = res.data;
                this.queries = queries;
            }, 
            error: () => {
                this.isLoading = false;
            }
        });
    }

}
