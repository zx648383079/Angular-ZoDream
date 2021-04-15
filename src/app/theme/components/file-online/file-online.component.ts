import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IUploadFile } from '../../models/open';
import { IPageQueries } from '../../models/page';
import { FileUploadService } from '../../services';

@Component({
    selector: 'app-file-online',
    templateUrl: './file-online.component.html',
    styleUrls: ['./file-online.component.scss']
})
export class FileOnlineComponent implements OnChanges {
    @Input() public accept = 'image/*';
    @Input() public multiple = false;
    @Input() public title = '选择在线文件';
    @Input() public height = 400;
    /**
     * 是否显示
     */
    @Input() public visible = false;
    /**
     * 确认事件
     */
    @Input() public confirmFn: (items: IUploadFile|IUploadFile[]) => void;
    @Output() public confirm = new EventEmitter<IUploadFile|IUploadFile[]>();

    public items: IUploadFile[] = [];
    public hasMore = true;
    public isLoading = false;
    public total = 0;
    public queries: IPageQueries = {
        page: 0,
        per_page: 20
    };
    public selectedItems: IUploadFile[] = [];

    constructor(
        private uploadService: FileUploadService,
    ) { }

    get boxStyle() {
        return {
            height: this.height + 'px',
            'margin-top': (- this.height / 2) + 'px'
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.accept) {
            this.items = [];
            this.selectedItems = [];
            this.queries.page = 0;
        }
    }

    public isSelected(item: IUploadFile): boolean {
        for (const i of this.selectedItems) {
            if (item.url === i.url) {
                return true;
            }
        }
        return false;
    }

    /**
     * 关闭弹窗
     * @param result 
     * @returns 
     */
    public close(result?: any) {
        if (typeof result === 'undefined') {
            this.visible = false;
            return;
        }
        if (!result) {
            this.visible = false;
            return;
        }
        this.visible = false;
        this.output();
    }

    private output() {
        const items = this.selectedItems.map(i => {
            return {...i};
        });
        const value = this.multiple ? items : (items.length > 0 ? items[0] : null);
        if (this.confirmFn) {
            this.confirmFn(value);
        }
        this.confirm.emit(value);
    }

    /**
     * 显示弹窗
     * @param cb 点击确认按钮事件
     */
    public open(cb?: (items: IUploadFile|IUploadFile[]) => void, title?: string) {
        this.confirmFn = cb;
        if (title) {
            this.title = title;
        }
        this.visible = true;
        if (this.queries.page > 0) {
            return;
        }
        this.tapPage(1);
    }

    public tapPage(page: number) {
        const queries = {...this.queries, page, accept: this.accept};
        const cb = this.accept.indexOf('image') >= 0 ? this.uploadService.images : this.uploadService.files;
        cb.call(this.uploadService, queries).subscribe(res => {
            this.items = res.data;
            this.hasMore = res.paging.more;
            this.total = res.paging.total;
            this.queries = queries;
            this.isLoading = false;
        }, () => {
            this.isLoading = false;
        });
    }

    public tapSelected(item: IUploadFile) {
        if (!this.multiple) {
            this.selectedItems = [item];
            this.visible = false;
            this.output();
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

}
