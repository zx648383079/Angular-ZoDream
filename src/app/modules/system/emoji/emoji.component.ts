import { Component, OnInit, inject } from '@angular/core';
import { IEmoji, IEmojiCategory } from '../../../theme/models/seo';
import { IPageQueries } from '../../../theme/models/page';
import { emptyValidate } from '../../../theme/validators';
import { SystemService } from '../system.service';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { UploadButtonEvent } from '../../../components/form';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-emoji',
    templateUrl: './emoji.component.html',
    styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {
    private service = inject(SystemService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IEmoji[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 1,
        per_page: 20,
        keywords: '',
        cat_id: 0,
    };
    public categories: IEmojiCategory[] = [];
    public editData: IEmoji = {} as any;
    public isMultiple = false;
    public isChecked = false;

    constructor() {
        this.service.emojiCategoryList({}).subscribe(res => {
            this.categories = res.data;
        });
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

    public toggleCheck(item?: IEmoji) {
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
        this.toastrService.confirm(`确认删除选中的${items.length}条反馈？`, () => {
            this.service.emojiRemove(items.map(i => i.id)).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.tapPage();
            });
        });
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
        this.service.emojiList(queries).subscribe({
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

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }

    public tapRemove(item: any) {
        this.toastrService.confirm('确定删除“' + item.name + '”表情？', () => {
            this.service.emojiRemove(item.id).subscribe(res => {
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

    public tapView(modal: DialogBoxComponent, item?: any) {
        this.editData = item ? {...item} : {
            id: 0,
            name: '',
            type: 0,
            content: '',
        };
        modal.open(() => {
            this.service.emojiSave(this.editData).subscribe(res => {
                this.toastrService.success($localize `Save Successfully`);
                this.tapPage();
            });
        }, () => !emptyValidate(this.editData.content));
    }

    public tapImport(modal: DialogBoxComponent) {
        modal.open();
    }

    public uploadFile(event: UploadButtonEvent) {
        const form = new FormData();
        form.append('file', event.files[0]);
        event.enter();
        this.service.emojiImport(form).subscribe({
            next: _ => {
                event.reset();
                this.tapRefresh();
                this.toastrService.success('导入成功！');
            }, 
            error: err => {
                event.reset();
                this.toastrService.warning(err);
            }
        });
    }

}
