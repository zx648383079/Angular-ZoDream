import { Component, OnInit } from '@angular/core';
import { IStorageFile } from '../../../model';
import { IPageQueries } from '../../../../../theme/models/page';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../../theme/services';
import { DiskService } from '../../disk.service';
import { DialogService } from '../../../../../components/dialog';
import { IItem } from '../../../../../theme/models/seo';
import { mapFormat } from '../../../../../theme/utils';
import { ButtonEvent } from '../../../../../components/form';

@Component({
  selector: 'app-disk-explorer-storage',
  templateUrl: './explorer-storage.component.html',
  styleUrls: ['./explorer-storage.component.scss']
})
export class ExplorerStorageComponent implements OnInit {

    public items: IStorageFile[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public tagItems: IItem[] = [
        {name: '公共', value: 1},
        {name: '内部', value: 2},
    ] 
    public queries: IPageQueries = {
        keywords: '',
        tag: 0,
        page: 1,
        per_page: 20,
    };
    public isMultiple = false;
    public isChecked = false;

    constructor(
        private service: DiskService,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private toastrService: DialogService,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapPage();
        });
    }

    
    public get checkedItems() {
        return this.items.filter(i => i.checked);
    }

    public toggleCheck(item?: IStorageFile) {
        if (!item) {
            this.isChecked = !this.isChecked;
            this.items.forEach(i => {
                i.checked = this.isChecked;
            });
            return;
        }
        item.checked = !item.checked;
        if (!item.checked) {
            this.isChecked = false;
            return;
        }
        if (this.checkedItems.length === this.items.length) {
            this.isChecked = true;
        }
    }

    public tapRemoveMultiple() {
        const items = this.checkedItems;
        if (items.length < 1) {
            this.toastrService.warning($localize `No item selected!`);
            return;
        }
        this.toastrService.confirm(`确认删除选中的${items.length}个文件？`, () => {
            this.service.storageRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
    }

    public formatTag(i: number) {
        return mapFormat(i, this.tagItems);
    }


    public tapReload(e?: ButtonEvent) {
        this.toastrService.confirm('确定执行重新索引？此操作将更新文件信息及查漏补缺！', () => {
            e?.enter();
            this.service.storageReload(this.queries.tag).subscribe({
                next: _ => {
                    e?.reset();
                    this.tapRefresh();
                },
                error: err => {
                    e?.reset();
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapSync(item: IStorageFile) {
        this.service.storageSync(item.id).subscribe({
            next: _ => {
                this.toastrService.success($localize `Sync finished`);
                this.tapPage();
            },
            error: err => {
                this.toastrService.error(err);
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
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

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const queries = {...this.queries, page};
        this.service.storageSearch(queries).subscribe({
            next: res => {
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.searchService.applyHistory(this.queries = queries);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public tapRemove(item: IStorageFile) {
        this.toastrService.confirm('确定删除“' + item.name + '”文件？', () => {
            this.service.storageRemove(item.id).subscribe(res => {
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
