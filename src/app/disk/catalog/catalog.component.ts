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
    MediaPlayerComponent
} from 'src/app/theme/components';


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

    @ViewChild(MediaPlayerComponent)
    private player: MediaPlayerComponent;

    public playerVisiable = false;

    public viewMode = false;

    public editMode = false;

    public checkedAll = false;

    public items: IDisk[] = [];

    public crumbs: ICrumb[] = [
        {
            name: '全部文件',
            icon: 'icon-desktop',
            disable: true
        },
    ];

    constructor(
        private service: DiskService
    ) {}

    ngOnInit() {
        this.tapRefresh();
    }

    get path() {
        const items = [];
        for (const item of this.crumbs) {
            if (item.id) {
                items.push(item.id);
            }
        }
        return items;
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
        this.playerVisiable = true;
        this.player.play({
            name: item.name,
            type: this.service.getTypeByExt(item.file.extension),
            size: item.file.size,
            thumb: item.file.thumb,
            url: item.file.url
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

    public tapRefresh() {
        const path = this.path;
        this.service.getCatalog({
            parent_id: path.length > 0 ? path[path.length - 1] : 0,
            path,
        }).subscribe(res => {
            this.items = res.map(i => {
                i.icon = this.service.getIconByExt(i.file_id < 1 ? undefined : i.file?.extension);
                return i;
            });
        });
    }
}
