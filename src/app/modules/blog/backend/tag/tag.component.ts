import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ITag } from '../../model';
import { BlogService } from '../blog.service';

@Component({
    standalone: false,
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss']
})
export class TagComponent {
    private readonly service = inject(BlogService);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ITag[]>([]);
    public readonly isLoading = signal(false);

    constructor() {
        this.tapRefresh();
    }

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        this.service.getTags().subscribe({
            next: res => {
                this.items.set(res);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public tapRemove(item: ITag) {
        this.toastrService.confirm('确定删除“' + item.name + '”标签？', () => {
            this.service.tagRemove(item.id).subscribe(res => {
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
