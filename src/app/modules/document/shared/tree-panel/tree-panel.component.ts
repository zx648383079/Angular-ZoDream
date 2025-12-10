import { Component, input, output, viewChild } from '@angular/core';
import { IDocTreeItem } from '../../model';
import { ContextMenuComponent } from '../../../../components/context-menu';
import { treeRemoveId } from '../util';

@Component({
    standalone: false,
    selector: 'app-doc-tree-panel',
    templateUrl: './tree-panel.component.html',
    styleUrls: ['./tree-panel.component.scss']
})
export class TreePanelComponent {

    private readonly contextMenu = viewChild(ContextMenuComponent);

    public readonly items = input<IDocTreeItem[]>([]);
    public readonly value = input<IDocTreeItem>(undefined);

    public readonly valueChange = output<any>();
    public readonly deleted = output<any>();
    public readonly created = output<any>();

    constructor() { }

    public tapContextMenu(e: MouseEvent, parent?: IDocTreeItem) {
        e.stopPropagation();
        this.contextMenu().show(e, [
            {
                name: '新建文件夹',
                icon: 'icon-folder-o',
            },
            {
                name: '新建文件',
                icon: 'icon-file-text-o'
            },
            {
                name: '删除',
                icon: 'icon-trash',
                active: !parent,
            },
        ].filter(i => !i.active), item => {
            if (item.name === '删除') {
                this.deleted.emit(parent);
                return;
            }
            this.created.emit({
                type: item.name.indexOf('文件夹') < 0 ? 0 : 1,
                id: 0,
                parent_id: parent ? parent.id : 0,
                name: '',
            });
        });
        return false;
    }

    public tapEdit(item: IDocTreeItem) {
        item.expanded = !item.expanded;
        const value = this.value();
        if (value && value.id === item.id) {
            return;
        }
        this.value = item;
        this.valueChange.emit(item);
    }

    public removeId(itemId: number) {
        this.items = treeRemoveId(this.items(), itemId);
    }
}
