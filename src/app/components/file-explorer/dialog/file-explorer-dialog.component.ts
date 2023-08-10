import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IBreadcrumbItem } from '../model';
import { FileExplorerPanelComponent } from '../panel/file-explorer-panel.component';

@Component({
  selector: 'app-file-explorer-dialog',
  templateUrl: './file-explorer-dialog.component.html',
  styleUrls: ['./file-explorer-dialog.component.scss']
})
export class FileExplorerDialogComponent implements OnInit {

    @ViewChild(FileExplorerPanelComponent)
    private panel: FileExplorerPanelComponent;
    public breadcrumbItems: IBreadcrumbItem[] = [
        {icon: 'icon-home', name: 'Home', path: ''},
    ];
    public visible = false;
    @Input() public mode = 0;
    public path = '';
    public keywords = '';
    public pathIsInputing = false;
    private historyItems: string[] = [];
    private historyIndex = -1;

    constructor() { }

    ngOnInit() {
    }

    public get canBack() {
        if (this.historyIndex < 0) {
            return this.historyItems.length > 1;
        }
        return this.historyIndex > 0;
    }

    public get canForward() {
        return this.historyIndex >= 0 && this.historyIndex < this.historyItems.length - 1;
    }

    public get canUp() {
        return this.breadcrumbItems.length > 1;
    }

    public open() {
        this.visible = true;
    }

    public tapBack() {
        if (!this.canBack) {
            return;
        }
        this.historyIndex = this.historyIndex < 0 ? this.historyItems.length - 2 : (this.historyIndex - 1);
        this.enterPath(this.historyItems[this.historyIndex], true);
    }

    public tapForward() {
        if (!this.canForward) {
            return;
        }
        this.pathIsInputing = false;
        this.historyIndex ++;
        this.enterPath(this.historyItems[this.historyIndex], true);
    }

    public tapUp() {
        if (!this.canUp) {
            return;
        }
        this.pathIsInputing = false;
        this.enterPath(this.breadcrumbItems[this.breadcrumbItems.length - 2].path);
    }

    public tapRefresh() {
        this.pathIsInputing = false;
        this.panel.tapRefresh();
    }

    public tapBreadcrumb(item: IBreadcrumbItem, e?: MouseEvent) {
        e?.stopPropagation();
        this.enterPath(item.path);
    }

    public tapConfirmPath() {
        this.pathIsInputing = false;
        this.enterPath(this.path);
    }


    public tapConfirmSearch() {
        this.pathIsInputing = false;
        this.panel.search(this.path, this.keywords);
    }

    public onCatalogTap(path: string) {
        this.pathIsInputing = false;
        this.enterPath(path);
    }

    public onFileTap(path: string) {
        this.pathIsInputing = false;
        this.applyPath(path);
    }

    /**
     * 
     * @param path 
     * @param useHistory 是否是从历史记录发出的， 
     */
    private enterPath(path: string, useHistory = false) {
        this.applyPath(path, useHistory);
        this.keywords = '';
        this.panel.search(path);
    }

    private addHistory(path: string) {
        if (this.historyIndex >= 0) {
            this.historyItems.splice(this.historyIndex + 0, this.historyItems.length - this.historyIndex);
        }
        this.historyIndex = -1;
        if (this.historyItems.length > 0 && this.historyItems[this.historyItems.length - 1] === path) {
            return;
        }
        this.historyItems.push(path);
    }

    /**
     * 
     * @param path 
     * @param useHistory 是否是从历史记录发出的， 
     */
    private applyPath(path: string, useHistory = false) {
        if (!/^\w+:/.test(path) && !path.startsWith('/')) {
            path = '/' + path;
        }
        if (path.length > 1 && path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
        }
        if (!useHistory) {
            this.addHistory(path);
        }
        this.path = path;
        const items: IBreadcrumbItem[] = [];
        const pushItem = (name: string, file: string) => {
            if (file === '/') {
                items.push( {icon: 'icon-home', name: 'Home', path: '/'});
                return;
            }
            if (name.length < 1) {
                return;
            }
            if (file.endsWith(':')) {
                items.push({icon: 'icon-server', name: name.toUpperCase(), path: file});
                return;
            }
            items.push({name: name, path: file});
        };
        let i = 0;
        if (!path.startsWith('/')) {
            pushItem('', '/');
        }
        while (i < path.length) {
            const j = path.indexOf('/', i);
            if (j < 0) {
                pushItem(path.substring(i), path);
                break;
            }
            if (i < j) {
                pushItem(path.substring(i, j), path.substring(0, j));
            } else if (i === 0) {
                pushItem('', '/');
            }
            if (j >= path.length - 1) {
                break;
            }
            i = j + 1;
        }
        this.breadcrumbItems = items;
    }
}
