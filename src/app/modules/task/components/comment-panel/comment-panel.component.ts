import { form, required } from '@angular/forms/signals';
import { Component, effect, inject, input, model, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { IPageQueries } from '../../../../theme/models/page';
import { ITaskComment } from '../../model';
import { TaskService } from '../../task.service';

@Component({
    standalone: false,
    selector: 'app-comment-panel',
    templateUrl: './comment-panel.component.html',
    styleUrls: ['./comment-panel.component.scss'],
})
export class CommentPanelComponent {
    private readonly service = inject(TaskService);
    private readonly toastrService = inject(DialogService);


    public readonly itemId = input(0);
    public readonly visible = model(false);
    public readonly commentForm = form(signal({
        content: ''
    }), schemaPath => {
        required(schemaPath.content);
    });
    public readonly items = signal<ITaskComment[]>([]);
    public readonly hasMore = signal(true);
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        keywords: '',
        page: 1,
        per_page: 20,
    }));

    private booted = 0;

    constructor() {
        effect(() => {
            if (this.visible() && this.itemId() > 0 && this.booted !== this.itemId()) {
                this.boot();
            }
        });
    }

    public open() {
        this.visible.set(true);
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
        if (this.commentForm().invalid()) {
            this.toastrService.warning('请输入内容');
            return;
        }
        this.service.commenSave({
            task_id: this.itemId(),
            ...this.commentForm().value()
        }).subscribe({
            next: _ => {
                this.commentForm.content().value.set('');
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
        this.goPage(this.queries.page().value() + 1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.commentList({...queries, task_id: this.itemId()}).subscribe({
            next: res => {
                this.hasMore.set(res.paging.more);
                this.isLoading.set(false);
                this.total.set(res.paging.total);
                this.items.set(res.data);
                this.queries().value.set(queries);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

}
