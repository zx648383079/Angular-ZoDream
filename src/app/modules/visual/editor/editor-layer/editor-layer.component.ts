import { Component, OnInit, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../../../components/context-menu';
import { DialogBoxComponent, DialogService } from '../../../../components/dialog';
import { emptyValidate } from '../../../../theme/validators';
import { EditorService } from '../editor.service';
import { ICatalogItem, MENU_ACTION, TreeEvent, TREE_ACTION, Widget } from '../model';
import { EditorLayer } from '../model/menu';

@Component({
    standalone: false,
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
    public bodyStyle: any = {};


    constructor(
        private dialogService: DialogService,
        private service: EditorService,
    ) { }

    ngOnInit() {
        this.service.editorSize$.subscribe(res => {
            if (!res) {
                return;
            }
            this.bodyStyle = {
                height: res.height - 32 + 'px'
            };
        });
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

    public onWidgetTap(e: TreeEvent) {
        if (e.action === TREE_ACTION.TRASH) {
            this.service.workspace.execute({
                action: MENU_ACTION.DELETE,
                data: [e.data]
            });
            return;
        }
        if (e.action === TREE_ACTION.COPY) {
            this.service.workspace.execute({
                action: MENU_ACTION.COPY,
                data: [e.data]
            });
            return;
        }
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
