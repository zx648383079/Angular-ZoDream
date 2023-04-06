import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FILE_PROVIDER, IFileCatalogItem, IFileItem, IFileProvider } from '../model';

@Component({
  selector: 'app-file-explorer-catalog',
  templateUrl: './file-explorer-catalog.component.html',
  styleUrls: ['./file-explorer-catalog.component.scss']
})
export class FileExplorerCatalogComponent implements OnInit {

    @Output() public pathChange = new EventEmitter<string>();
    public items: IFileCatalogItem[] = [
        {
            icon: 'icon-home',
            name: $localize `Home`,
            path: '/',
        },
        {
            icon: 'icon-desktop',
            name: $localize `Drives`,
            expandable: true,
            expanded: true,
            children: [],
        }
    ];
    public activePath = '';

    constructor(
        @Inject(FILE_PROVIDER) private service: IFileProvider
    ) { }

    ngOnInit() {
        this.service.driveList().subscribe(data => {
            this.items[1].children = data.map(i => this.formatFile(i, 1));
        });
    }

    public getItemStyle(item: IFileCatalogItem) {
        if (!item.level || item.level < 1) {
            return {};
        }
        return {
            'padding-left': item.level * .6 + 'rem',
        };
    }

    public toggleOpen(item: IFileCatalogItem) {
        if (!item.expandable) {
            return;
        }
        item.expanded = !item.expanded;
        if (item.loading !== 1 || !item.expanded) {
            return;
        }
        item.loading = 2;
        this.service.search({
            path: item.path,
            filter: 'folder'
        }).subscribe({
            next: res => {
                item.loading = 0;
                item.children = res.data.map(i => this.formatFile(i, (item.level ? item.level : 0) + 1));
            },
            error: _ => {
                item.loading = 1;
            }
        });
    }

    private formatFile(item: IFileItem, level?: number): IFileCatalogItem {
        return {
            icon: item.icon,
            name: item.name,
            path: item.path,
            expandable: item.isFolder,
            level,
            loading: item.isFolder ? 1 : 0,
        };
    }

    public tapItem(item: IFileCatalogItem) {
        if (typeof item.path === 'undefined') {
            return;
        }
        this.activePath = item.path;
        this.pathChange.emit(this.activePath);
    }

}
