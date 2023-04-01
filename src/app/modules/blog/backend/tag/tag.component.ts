import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { ITag } from '../../model';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

    public items: ITag[] = [];
    public isLoading = false;

    constructor(
        private service: BlogService,
        private toastrService: DialogService,
    ) {
        this.tapRefresh();
    }

    ngOnInit() {}

    /**
     * tapRefresh
     */
    public tapRefresh() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.getTags().subscribe({
            next: res => {
                this.items = res;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
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
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        });
    }

}
