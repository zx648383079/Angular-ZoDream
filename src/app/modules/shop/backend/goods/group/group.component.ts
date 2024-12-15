import { Component, OnInit } from '@angular/core';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IAttributeGroup } from '../../../model';
import { AttributeService } from '../attribute.service';
import { IPageQueries } from '../../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { emptyValidate } from '../../../../../theme/validators';

@Component({
    standalone: false,
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

    public items: IAttributeGroup[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        page: 1,
        per_page: 20,
    };
    public editData: IAttributeGroup = {} as any;

    constructor(
        private service: AttributeService,
        private toastrService: DialogService,
        private route: ActivatedRoute,
        private searchService: SearchService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    public open(modal: DialogEvent, item?: IAttributeGroup) {
        this.editData = item ? {...item} : {} as any;
        modal.open(() => {
            this.service.groupSave({...this.editData}).subscribe({
                next: _ => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.tapRefresh();
                },
                error: err => {
                    this.toastrService.error(err);
                }
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
        this.service.groupList(queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: IAttributeGroup) {
        this.toastrService.confirm('确定删除“' + item.name + '”分组？', () => {
            this.service.groupRemove(item.id).subscribe(res => {
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
