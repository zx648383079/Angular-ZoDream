import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    DiskService
} from '../disk.service';
import {
    IDisk
} from '../model';
import { emptyValidate } from '../../../theme/validators';
import { DialogBoxComponent, DialogService } from '../../../components/dialog';
import { IUploadItem, UploaderComponent } from '../uploader/uploader.component';
import { FileUploadService, SearchService, ThemeService } from '../../../theme/services';
import { ImagePlayerComponent, MoviePlayerComponent, MusicPlayerComponent, PlayerEvent } from '../../../components/media-player';
import { ParallelHasher } from 'ts-md5';
import { ActivatedRoute } from '@angular/router';
import { IPageQueries } from '../../../theme/models/page';
import { UploadStatus } from '../../../theme/services/uploader';
import { PullToRefreshComponent } from '../../../components/tablet';
import { Subscription } from 'rxjs';


interface ICrumb {
    id?: number;
    name: string;
    icon?: string;
    disable?: boolean;
}

@Component({
    standalone: false,
    selector: 'app-disk-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {

    @ViewChild(PullToRefreshComponent)
    public pullBox: PullToRefreshComponent;
    @ViewChild(UploaderComponent)
    private uploader: UploaderComponent;
    @ViewChild(MoviePlayerComponent)
    private moviePlayer: PlayerEvent;
    @ViewChild(MusicPlayerComponent)
    private musicPlayer: PlayerEvent;
    @ViewChild(ImagePlayerComponent)
    private imagePlayer: PlayerEvent;

    public playerMode = 0; // 1 视频 2 音频 3 图片
    public viewMode = false;
    public editMode = false;
    public checkedAll = false;
    public items: IDisk[] = [];
    public queries: IPageQueries = {
        keywords: '',
        type: '',
        page: 1,
        per_page: 20,
    };
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
    public playerStyle: any = {};
    private subItems = new Subscription();

    constructor(
        private service: DiskService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
        private searchService: SearchService,
        private themeService: ThemeService,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.queries = this.searchService.getQueries(params, this.queries);
            this.tapRefresh();
        });
        this.subItems.add(
            this.themeService.navigationChanged.subscribe(res => {
                this.playerStyle = {
                    left: res.paneWidth + 'px',
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subItems.unsubscribe();
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

    get checkCount() {
        let count = 0;
        for (const item of this.items) {
            if (item.checked) {
                count ++;
            }
        }
        return count;
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
        this.playerMode = 0;
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
        this.play(item);
    }

    private play(item: IDisk) {
        const items = this.filterItems.filter(i => i.type === item.type);
        this.service.files(items.map(i => i.id)).subscribe(res => {
            if (!res.data || res.data.length === 0) {
                return;
            }
            let player: PlayerEvent;
            if (item.type === 'image') {
                this.playerMode = 3;
                player = this.imagePlayer;
            } else if (item.type === 'music') {
                this.playerMode = 2;
                player = this.musicPlayer;
            } else if (item.type === 'movie') {
                this.playerMode = 1;
                player = this.moviePlayer;
            } else {
                return;
            }
            player.stop();
            let j = 0;
            const formatItems = res.data.map((i, k) => {
                if (i.id === item.id) {
                    j = k;
                }
                let lyrics: string;
                if (i.subtitles && i.subtitles.length > 0) {
                    lyrics = i.subtitles[0].url;
                } else if (i.lyrics && i.lyrics.length > 0) {
                    lyrics = i.lyrics[0].url;
                }
                return {
                    name: i.name,
                    source: i.url,
                    cover: i.thumb,
                    lyrics 
                };
            });
            player.push(...formatItems);
            player.play(formatItems[j]);
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
            created_at: new Date(),
            file: undefined,
        };
        this.uploader.append(item);
        hasher.hash(file).then((md5: string) => {
            item.md5 = md5;
            item.status = 4;
            item.file = this.uploadService.uploadChunk<IDisk>({
                upload: 'disk/upload',
                verify: 'disk/upload/check',
                chunk: 'disk/upload/chunk',
                merge: 'disk/upload/finish'
            }, file, {
                parent_id: this.lastFolder,
            }, md5);
            item.file.$progress.subscribe(p => {
                this.uploader.formatProgress(item, p);
            })
            item.file.$finish.subscribe(res => {
                this.items.push(this.formatItem(res));
            });
            item.file.$status.subscribe(s => {
                switch (s) {
                    case UploadStatus.Queue:
                        item.status = 1;
                        break;
                    case UploadStatus.Paused:
                        item.status = 2;
                        break;
                    case UploadStatus.Uploading:
                        item.status = 5;
                        break;
                    case UploadStatus.Checking:
                        item.status = 3;
                        break;
                    case UploadStatus.CheckedDone:
                        item.status = 6;
                        break;
                    case UploadStatus.Done:
                        item.status = 7;
                        break;
                    case UploadStatus.Failure:
                        item.status = 8;
                        break;
                    default:
                        break;
                }
            });
            item.file.start();
            // this.uploadPreview(item, () => {
            //     this.uploadFile(item, file);
            // });
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

    // private uploadFile(item: IUploadItem, file: File) {
    //     item.status = 5;
    //     this.uploadService.uploadChunk('disk/upload/chunk', file, loaded => {
    //         this.uploader.formatProgress(item, loaded);
    //     }, 'file', {
    //         md5: item.md5,
    //     }).subscribe(_ => {
    //         this.service.uploadFinish({
    //             name: item.name,
    //             md5: item.md5,
    //             parent_id: this.lastFolder,
    //             size: item.total,
    //         }).subscribe({
    //             next: res => {
    //                 item.status = 7;
    //                 this.items.push(this.formatItem(res));
    //             },
    //             error: err => {
    //                 item.status = 8;
    //                 this.toastrService.error(err);
    //             }
    //         });
    //     });
    // }

    public tapRefresh() {
        this.goPage(1);
    }

    public tapMore() {
        if (!this.hasMore) {
            return;
        }
        this.goPage(this.queries.page + 1);
    }

    public goPage(page: number) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.pullBox?.startLoad();
        const query = emptyValidate(this.queries.keywords) && emptyValidate(this.queries.type) ? this.service.getCatalog({
            id: this.lastFolder,
            path: this.path,
            page
        }) : this.service.search({
            keywords: this.queries.keywords,
            type: this.queries.type,
            page
        });
        query.subscribe({
            next: res => {
                this.queries.page = page;
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
        item.type = this.service.getTypeByExt(item.file_id < 1 ? undefined : item.file?.extension);
        item.icon = this.service.getIconByExt(item.file_id < 1 ? undefined : item.file?.extension);
        return item;
    }
}
