import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../dialog';
import { ICmsCategory } from '../../model';
import { CmsService } from '../cms.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICmsCategory[] = [];
    public site = 0;

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        
    }
  
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.site = parseInt(params.site);
            this.tapRefresh();
        });
    }

    public tapRefresh() {
        this.service.categoryList(this.site).subscribe(res => {
            this.items = res.data;
        });
    }
  
    public tapRemove(item: ICmsCategory) {
        if (!confirm('确定删除“' + item.title + '”分类？')) {
            return;
        }
        this.service.categoryRemove(this.site, item.id).subscribe(res => {
            if (!res.data) {
                return;
            }
            this.toastrService.success('删除成功');
            this.items = this.items.filter(it => {
                return it.id !== item.id;
            });
        });
    }

}
