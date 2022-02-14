import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    DiskService
} from '../disk.service';
import {
    IDisk
} from '../model';
import {
    PullToRefreshComponent
} from '../../theme/components';
import { emptyValidate } from '../../theme/validators';
import { MediaPlayerComponent } from '../media-player/media-player.component';
import { DialogBoxComponent, DialogService } from '../../dialog';
import { IUploadItem, UploaderComponent } from '../uploader/uploader.component';
import { ParallelHasher } from 'ts-md5/dist/parallel_hasher';
import { FileUploadService } from '../../theme/services';


interface ICrumb {
    id?: number;
    name: string;
    icon?: string;
    disable?: boolean;
}

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

    @ViewChild(PullToRefreshComponent)
    public pullBox: PullToRefreshComponent;
    @ViewChild(UploaderComponent)
    private uploader: UploaderComponent;
    @ViewChild(MediaPlayerComponent)
    private player: MediaPlayerComponent;

    public playerVisiable = false;
    public viewMode = false;
    public editMode = false;
    public checkedAll = false;
    public items: IDisk[] = [];
    public page = 1;
    public hasMore = true;
    public isLoading = false;
    public crumbs: ICrumb[] = [
        {
            name: $localize `All files`,
            icon: 'icon-desktop',
            disable: true
        },
    ];
    public sortKey = '';
    public orderAsc = true;
    public editData: any = {};

    constructor(
        private service: DiskService,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) {}

    ngOnInit() {
        this.tapRefresh();
    }

    get path() {
        const items = [];
        for (const item of this.crumbs) {
            items.push(item.id || '');
        }
        return items.join('/');
    }

    get lastFolder() {
        if (this.crumbs.length < 2) {
            return '';
        }
        return this.crumbs[this.crumbs.length - 1].id;
    }

    public get filterItems() {
        const items = this.items;
        if (!this.sortKey) {
            return items;
        }
        return items.sort((a, b) => {
            const [av, bv] = this.orderAsc ? [this.formatValue(a, this.sortKey), this.formatValue(b, this.sortKey)] : [this.formatValue(b, this.sortKey), this.formatValue(a, this.sortKey)];
            if (av == bv) {
                return 0;
            }
            if (typeof av === 'undefined') {
                return 1;
            }
            if (typeof bv === 'undefined') {
                return -1;
            }
            if (typeof av === 'number') {
                return av > bv ? 1 : -1;
            }
            return (av as string).localeCompare(bv, $localize `en`);
        });
    }

    private formatValue(item: IDisk, k: string) {
        if (k === 'size') {
            return item.file ? item.file[k] : '';
        }
        return item[k];
    }

    public tapBack() {
        if (this.crumbs.length < 2) {
            return;
        }
        this.crumbs.pop();
        this.tapRefresh();
    }

    public tapSort(i: string, asc?: boolean) {
        if (typeof asc === 'boolean') {
            this.sortKey = i;
            this.orderAsc = asc;
            return;
        }
        if (this.sortKey == i) {
            this.orderAsc = !this.orderAsc;
        } else {
            this.sortKey = i;
            this.orderAsc = true;
        }
    }

    public tapForward() {
    }

    public tapFile(item: IDisk) {
        this.playerVisiable = false;
        if (this.editMode) {
            item.checked = !item.checked;
            if (!item.checked) {
                this.checkedAll = false;
            } else {
                this.checkedIfAll();
            }
            return;
        }
        if (item.file_id < 1 || !item.file) {
            this.tapFolder(item);
            return;
        }
        if (!item.file.url) {
            return;
        }
        this.service.file([
            item.id,
        ]).subscribe(res => {
            this.playerVisiable = true;
            res.type = this.service.getTypeByExt(res.extension);
            this.player.play(res);
        });
    }

    public tapFolder(item: IDisk) {
        if (item.file_id > 0 && item.file) {
            return;
        }
        this.crumbs.push({
            id: item.id,
            name: item.name,
            icon: 'icon-folder-o',
        });
        this.tapRefresh();
    }

    public checkedIfAll() {
        for (const item of this.items) {
            if (item.type === 'group') {
                continue;
            }
            if (!item.checked) {
                return;
            }
        }
        this.checkedAll = true;
    }

    public tapCheckAll() {
        this.checkedAll = !this.checkedAll;
        for (const item of this.items) {
            if (item.type === 'group') {
                continue;
            }
            item.checked = this.checkedAll;
        }
    }

    public tapOpenEdit(modal: DialogBoxComponent) {
        this.editData = {name: ''};
        modal.open(() => {
            this.service.create({
                name: this.editData.name,
                parent_id: this.lastFolder
            }).subscribe({
                next: res => {
                    this.items.push(this.formatItem(res));
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => !emptyValidate(this.editData.name));
    }

    public tapUpload(e: any) {
        this.uploader.visible = true;
        this.onUploading(e.target.files as FileList);
    }

    public onUploading(files: File[]|FileList) {
        let hasher = new ParallelHasher('/md5/md5_worker.js');
        for (let i = 0; i < files.length; i++) {
            this.uploadOne(hasher, files[i]);
        }
    }

    private uploadOne(hasher: ParallelHasher, file: File) {
        const item: IUploadItem = {
            name: file.name,
            progress: 0,
            total: file.size,
            status: 3,
            created_at: new Date()
        };
        this.uploader.append(item);
        hasher.hash(file).then((md5: string) => {
            item.md5 = md5;
            item.status = 4;
            this.uploadPreview(item, () => {
                this.uploadFile(item, file);
            });
        }).catch(_ => {
            item.status = 8;
        });
    }

    private uploadPreview(item: IUploadItem, cb: () => void) {
        this.service.uploadCheck({
            name: item.name,
            md5: item.md5,
            parent_id: this.lastFolder
        }).subscribe(res => {
            if (res.code == 200) {
                item.status = 6;
                this.items.push(this.formatItem(res.data));
                return;
            }
            if (res.code == 2) {
                cb();
            }
        });
    }

    private uploadFile(item: IUploadItem, file: File) {
        item.status = 5;
        this.uploadService.uploadChunk('disk/upload/chunk', file, loaded => {
            this.uploader.formatProgress(item, loaded);
        }, 'file', {
            md5: item.md5,
        }).subscribe(_ => {
            this.service.uploadFinish({
                name: item.name,
                md5: item.md5,
                parent_id: this.lastFolder,
                size: item.total,
            }).subscribe({
                next: res => {
                    item.status = 7;
                    this.items.push(this.formatItem(res));
                },
                error: err => {
                    item.status = 8;
                    this.toastrService.error(err);
                }
            });
        });
    }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.pullBox?.startLoad();
        this.service.getCatalog({
            id: this.lastFolder,
            path: this.path,
            page
        }).subscribe({
            next: res => {
                this.page = page;
                this.hasMore = res.paging.more;
                this.isLoading = false;
                const items = res.data.map(i => {
                    return this.formatItem(i);
                });
                this.items = page < 2 ? items : [].concat(this.items, items);
                this.pullBox?.endLoad();
            }, 
            error: () => {
                this.isLoading = false;
                this.pullBox?.endLoad();
            }
        });
    }

    private formatItem(item: IDisk): IDisk {
        item.icon = this.service.getIconByExt(item.file_id < 1 ? undefined : item.file?.extension);
        return item;
    }
}
