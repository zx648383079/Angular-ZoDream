import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IUploadFile } from '../../../theme/models/open';
import { IPageQueries } from '../../../theme/models/page';
import { FileUploadService, SearchService } from '../../../theme/services';
import { SearchDialogEvent } from '../../dialog';
import { IItem } from '../../../theme/models/seo';

@Component({
    selector: 'app-file-online',
    templateUrl: './file-online.component.html',
    styleUrls: ['./file-online.component.scss']
})
export class FileOnlineComponent implements OnChanges, SearchDialogEvent {
    @Input() public accept = 'image/*';
    @Input() public multiple = false;
    @Input() public placeholder = $localize `Select online file`;
    /**
     * 是否显示
     */
    @Input() public visible = false;

    public items: IUploadFile[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        keywords: '',
        accept: '*/*',
        page: 1,
        per_page: 20,
    };
    public typeItems: IItem[] = [];
    public selectedItems: IUploadFile[] = [];
    public onlySelected = false;
    private confirmFn: (items: IUploadFile|IUploadFile[]) => void;
    private checkFn: (items: IUploadFile[]) => boolean;

    constructor(
        private uploadService: FileUploadService,
        private searchService: SearchService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.accept) {
            this.items = [];
            this.selectedItems = [];
            this.queries.page = 0;
            this.queries.accept = this.accept;
            this.typeItems = this.accept === '*/*' || !this.accept ? [
                {name: $localize `All files`, value: '*/*'},
                {name: $localize `Image`, value: 'image/*'},
                {name: $localize `Video`, value: 'video/*'},
                {name: $localize `Audio`, value: 'audio/*'},
            ] : [];
        }
    }

    public open(confirm: (data: IUploadFile|IUploadFile[]) => void): void;
    public open(data: any|any[], confirm: (data: IUploadFile|IUploadFile[]) => void): void;
    public open(data: any|any[], confirm: (data: IUploadFile|IUploadFile[]) => void, check: (data: IUploadFile[]) => boolean): void;
    public open(data: any, confirm?: (data: IUploadFile|IUploadFile[]) => void, check?: (data: IUploadFile[]) => boolean) {
        this.visible = true;
        if (typeof data === 'function') {
            this.confirmFn = data;
        } else {
            this.formatValue(data);
            this.confirmFn = confirm;
        }
        this.checkFn = check;
    }

    public close() {
        this.visible = false;
    }

    public tapToggleOnly() {
        this.onlySelected = !this.onlySelected;
    }

    public isSelected(item: IUploadFile) {
        for (const i of this.selectedItems) {
            if (i.url === item.url) {
                return true;
            }
        }
        return false;
    }

    public tapSelected(item: IUploadFile) {
        if (!this.multiple) {
            this.selectedItems = [item];
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (item.url === this.selectedItems[i].url) {
                this.selectedItems.splice(i, 1);
                return;
            }
        }
        this.selectedItems.push(item);
    }

    public tapYes() {
        if (this.checkFn && this.checkFn(this.selectedItems) === false) {
            return;
        }
        if (this.multiple) {
            this.output(this.selectedItems);
            return;
        }
        this.output(this.selectedItems.length > 0 ? this.selectedItems[0] : null);
    }

    private output(items: any) {
        if (this.confirmFn) {
            this.confirmFn(items);
        }
        this.visible = false;
    }

    public tapCancel() {
        this.selectedItems = [];
    }

    public get formatItems(): IUploadFile[] {
        return this.onlySelected ? this.selectedItems.map(i => i as IUploadFile) : this.items;
    }


    public get selectedCount() {
        return this.selectedItems.length;
    }

    /**
     * tapRefresh
     */
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
        const cb = this.accept.indexOf('image') >= 0 ? this.uploadService.images : this.uploadService.files;
        cb.call(this.uploadService, queries).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
                this.hasMore = res.paging.more;
                this.total = res.paging.total;
                this.queries = queries
            }, 
            error: _ => {
                this.isLoading = false;
            }
        });
    }

    public tapSearch(form: any) {
        this.queries = this.searchService.getQueries(form, this.queries);
        this.tapRefresh();
    }


    private formatValue(data: any) {
        if (!data) {
            this.selectedItems = [];
            return;
        }
        if (typeof data !== 'object') {

        } else if (data instanceof Array) {
            if (data.length < 1) {
                this.selectedItems = [];
                return;
            }
            if (typeof data[0] === 'object') {
                this.selectedItems = [...data];
                return;
            }
        } else {
            this.selectedItems = [data];
            return;
        }
        // this.service.search({
        //     id: data,
        //     per_page: typeof data === 'object' ? data.length : 20,
        // }).subscribe(res => {
        //     this.selectedItems = res.data;
        // });
    }

}
