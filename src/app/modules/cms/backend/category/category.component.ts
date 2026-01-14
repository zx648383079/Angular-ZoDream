import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ICmsCategory } from '../../model';
import { CmsService } from '../cms.service';
import { toggleTreeItem } from '../../../../theme/utils';

@Component({
    standalone: false,
    selector: 'app-cms-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(CmsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly items = signal<ICmsCategory[]>([]);
    public site = 0;
  
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.site = parseInt(params.site);
            this.tapRefresh();
        });
    }

    public toggleTree(i: number) {
        this.items.set(toggleTreeItem(this.items(), i));
    }

    public tapRefresh() {
        this.service.categoryList(this.site).subscribe(res => {
            this.items.set(res.data);
        });
    }
  
    public tapRemove(item: ICmsCategory) {
        this.toastrService.confirm('确定删除“' + item.title + '”分类？', () => {
            this.service.categoryRemove(this.site, item.id).subscribe(res => {
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
