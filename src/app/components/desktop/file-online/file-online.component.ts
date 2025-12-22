import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { IUploadFile } from '../../../theme/models/open';
import { IPageQueries } from '../../../theme/models/page';
import { FileUploadService, SearchService } from '../../../theme/services';
import { SearchDialogEvent } from '../../dialog';
import { IItem } from '../../../theme/models/seo';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-file-online',
    templateUrl: './file-online.component.html',
    styleUrls: ['./file-online.component.scss']
})
export class FileOnlineComponent implements SearchDialogEvent {
    private readonly uploadService = inject(FileUploadService);
    private readonly searchService = inject(SearchService);

    public readonly accept = input('image/*');
    public readonly multiple = input(false);
    public readonly placeholder = input($localize `Select online file`);
    /**
     * 是否显示
     */
    public readonly visible = signal(false);

    public readonly items = signal<IUploadFile[]>([]);
    private hasMore = true;
    public readonly isLoading = signal(false);
    public readonly total = signal(0);
    public readonly queries = form(signal<IPageQueries>({
        keywords: '',
        accept: '*/*',
        page: 1,
        per_page: 20,
    }));
    public typeItems: IItem[] = [];
    public selectedItems: IUploadFile[] = [];
    public onlySelected = false;
    private confirmFn: (items: IUploadFile|IUploadFile[]) => void;
    private checkFn: (items: IUploadFile[]) => boolean;

    constructor() {
        effect(() => {
            const accept = this.accept();
            this.items.set([]);
            this.selectedItems = [];
            this.queries.page().value.set(0);
            this.queries.accept().value.set(accept);
            this.typeItems = accept === '*/*' || !accept ? [
                {name: $localize `All files`, value: '*/*'},
                {name: $localize `Image`, value: 'image/*'},
                {name: $localize `Video`, value: 'video/*'},
                {name: $localize `Audio`, value: 'audio/*'},
            ] : [];
        });
    }

    public open(confirm: (data: IUploadFile|IUploadFile[]) => void): void;
    public open(data: any|any[], confirm: (data: IUploadFile|IUploadFile[]) => void): void;
    public open(data: any|any[], confirm: (data: IUploadFile|IUploadFile[]) => void, check: (data: IUploadFile[]) => boolean): void;
    public open(data: any, confirm?: (data: IUploadFile|IUploadFile[]) => void, check?: (data: IUploadFile[]) => boolean) {
        this.visible.set(true);
        if (typeof data === 'function') {
            this.confirmFn = data;
        } else {
            this.formatValue(data);
            this.confirmFn = confirm;
        }
        this.checkFn = check;
    }

    public close() {
        this.visible.set(false);
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
        if (!this.multiple()) {
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
        if (this.multiple()) {
            this.output(this.selectedItems);
            return;
        }
        this.output(this.selectedItems.length > 0 ? this.selectedItems[0] : null);
    }

    private output(items: any) {
        if (this.confirmFn) {
            this.confirmFn(items);
        }
        this.visible.set(false);
    }

    public tapCancel() {
        this.selectedItems = [];
    }

    public readonly formatItems = computed(() => {
        return this.onlySelected ? this.selectedItems.map(i => i as IUploadFile) : this.items();
    });


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
        this.goPage(this.queries.page().value());
    }

    public tapMore() {
        this.goPage(this.queries.page().value() + 1);
    }

    /**
     * goPage
     */
    public goPage(page: number) {
        if (this.isLoading()) {
            return;
        }
        this.isLoading.set(true);
        const queries = {...this.queries().value(), page};
        const cb = this.accept().indexOf('image') >= 0 ? this.uploadService.images : this.uploadService.files;
        cb.call(this.uploadService, queries).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
                this.hasMore = res.paging.more;
                this.total.set(res.paging.total);
                this.queries().value.set(queries)
            },
            error: _ => {
                this.isLoading.set(false);
            }
        });
    }

    public tapSearch() {

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
