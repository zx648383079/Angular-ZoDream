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
} from 'src/app/theme/models/disk';
import {
    MediaPlayerComponent, PullToRefreshComponent
} from 'src/app/theme/components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
            name: '全部文件',
            icon: 'icon-desktop',
            disable: true
        },
    ];

    public editData: any;

    constructor(
        private service: DiskService,
        private modalService: NgbModal,
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
            return 0;
        }
        return this.crumbs[this.crumbs.length - 1].id;
    }

    public tapBack() {
        if (this.crumbs.length < 2) {
            return;
        }
        this.crumbs.pop();
        this.tapRefresh();
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
        this.service.allowUrl([
            item.file.thumb,
            item.file.url
        ]).subscribe(res => {
            this.playerVisiable = true;
            this.player.play({
                name: item.name,
                type: this.service.getTypeByExt(item.file.extension),
                size: item.file.size,
                thumb: res.data[0],
                url: res.data[1]
            });
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

    public tapOpenEdit(content: any) {
        this.editData = {name: ''};
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(_ => {
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
        }).subscribe(res => {
            this.page = page;
            this.hasMore = res.paging.more;
            this.isLoading = false;
            const items = res.data.map(i => {
                i.icon = this.service.getIconByExt(i.file_id < 1 ? undefined : i.file?.extension);
                return i;
            });
            this.items = page < 2 ? items : [].concat(this.items, items);
            this.pullBox?.endLoad();
        }, () => {
            this.isLoading = false;
            this.pullBox?.endLoad();
        });
    }
}
