import { Component, inject, input, signal } from '@angular/core';
import { ForumService } from '../../forum.service';
import { IThreadPost } from '../../../model';
import { form } from '@angular/forms/signals';
import { DialogService } from '../../../../../components/dialog';

@Component({
    standalone: false,
    selector: 'app-thread-post-panel',
    templateUrl: './thread-post-panel.component.html',
    styleUrls: ['./thread-post-panel.component.scss']
})
export class ThreadPostPanelComponent {

    private readonly service = inject(ForumService);
    private readonly toastrService = inject(DialogService);

    public readonly target = input(0);
    public readonly isBooted = signal(false);

    public readonly items = signal<IThreadPost[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal({
        page: 1,
        per_page: 20,
        keywords: '',
    }));
    


    public tapRefresh() {
        this.isBooted.set(true);
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    public goPage(page: number) {
        if (this.isLoading() || !this.target()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        this.service.postList({...queries, thread: this.target()}).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries);
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapEdit(item: IThreadPost) {
        this.toastrService.prompt(item.content, value => {
            item.content = value;
            this.service.postSave({
                id: item.id,
                content: value
            }).subscribe(res => {
                item.html = res.html;
                this.toastrService.success($localize `Save Successfully`);
                this.items.update(v => {
                    return [...v];
                });
            });
        });
    }

    public tapRemove(item: IThreadPost) {
        this.toastrService.confirm('确定删除“' + item.id + '”帖子？', () => {
            this.service.postRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        });
    }
}
