import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../context-menu';

@Component({
  selector: 'app-book-editor',
  templateUrl: './book-editor.component.html',
  styleUrls: ['./book-editor.component.scss']
})
export class BookEditorComponent implements OnInit {

    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;

    public data: any;
    public catalog = [];
    public categories = [];
    
    constructor() { }

    ngOnInit() {
    }

    public tapEdit(item: any) {

    }

    public tapContextMenu(event: MouseEvent, parent?: any) {
        return this.contextMenu.show(event, [
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
                disable: !parent,
            },
        ].filter(i => !i.disable), item => {
            if (item.name === '删除') {
                this.tapRemove(parent);
                return;
            }
        });
    }

    public tapRemove(item: any) {

    }

}
