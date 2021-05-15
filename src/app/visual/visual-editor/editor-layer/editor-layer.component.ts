import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../../context-menu';
import { DialogBoxComponent, DialogService } from '../../../dialog';
import { emptyValidate } from '../../../theme/validators';
import { EditorService } from '../editor.service';
import { ICatalogItem, TreeEvent, TREE_ACTION, Widget } from '../model';
import { EditorLayer } from '../model/menu';

@Component({
  selector: 'app-editor-layer',
  templateUrl: './editor-layer.component.html',
  styleUrls: ['./editor-layer.component.scss']
})
export class EditorLayerComponent implements OnInit {

    @ViewChild("catalogModal")
    public catalogModal: DialogBoxComponent;
    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;

    public tabIndex = 0;

    public catalogItems: ICatalogItem[] = [];

    public weightItems: Widget[] = [];

    public editData: any = {};

    constructor(
        private dialogService: DialogService,
        private service: EditorService,
    ) { }

    ngOnInit() {
        this.service.widgetCellItems$.subscribe(res => {
            this.weightItems = res;
        });
        this.service.catalogItems$.subscribe(res => {
            this.catalogItems = res;
        });
    }

    public tapEditCatalog() {

    }

    public tapNewCatalog(group = false) {
        this.editData =  {
            name: '',
            isGroup: group,
        };
        this.catalogModal.open(() => {
            this.service.pushCatalog({
                name: this.editData.name,
                canExpand: this.editData.isGroup,
            });
        }, () => !emptyValidate(this.editData.name), group ? '新增分组' : '新增页面');
    }

    public onCatalogTap(e: TreeEvent) {
        if (e.action === TREE_ACTION.TRASH) {
            this.dialogService.confirm('是否删除' + (e.data.canExpand ? '分组' : '页面') + ' ' + e.data.name, () => {

            });
            return;
        }
        if (e.action === TREE_ACTION.CONTEXT) {
            this.contextMenu.show(e.event, EditorLayer)
            return;
        }
    }

}
