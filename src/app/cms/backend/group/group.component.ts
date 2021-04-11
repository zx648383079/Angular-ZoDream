import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from '../../../theme/components';
import { IPageQueries } from '../../../theme/models/page';
import { applyHistory, getQueries } from '../../../theme/query';
import { emptyValidate } from '../../../theme/validators';
import { ICmsGroup } from '../../model';
import { CmsService } from '../cms.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

    public items: ICmsGroup[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        type: 0,
    };
    public editData: ICmsGroup = {} as any;
    public typeItems = ['栏目', '内容'];

    constructor(
        private service: CmsService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogBoxComponent, item?: ICmsGroup) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            description: '',
            type: 0,
        };
        modal.open(() => {
            this.service.groupSave(this.editData).subscribe(_ => {
                this.toastrService.success('保存成功');
                this.tapRefresh();
            });
        }, () => !emptyValidate(this.editData.name));
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapPage() {
        this.goPage(this.queries.page);
    }

    public tapMore() {
        this.goPage(this.queries.page + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.groupList(queries).subscribe(res => {
            this.isLoading = false;
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            applyHistory(this.queries = queries);
        });
    }

    public tapSearch(form: any) {
        this.queries = getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: ICmsGroup) {
        if (!confirm('确定删除“' + item.name + '”分组？')) {
            return;
        }
        this.service.siteRemove(item.id).subscribe(res => {
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
