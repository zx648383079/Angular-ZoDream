import { Component } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';
import { IItem } from '../../../../theme/models/seo';

@Component({
  selector: 'app-editor-dropdown',
  templateUrl: './editor-dropdown.component.html',
  styleUrls: ['./editor-dropdown.component.scss']
})
export class EditorDropdownComponent implements IEditorModal {

    public visible = false;
    public items: IItem[] = [];
    public selected = '';
    private confirmFn: EditorModalCallback;

    constructor() {
        for (let i = 0; i < 5; i++) {
            this.items.push({name: i.toString(), value: i});
        }
    }

    public open(data: any, cb: EditorModalCallback) {
        this.visible = true;
        this.confirmFn = cb;
    }

    public tapConfirm(item: IItem) {
        this.visible = false;
        this.selected = item.value;
        if (this.confirmFn) {
            this.confirmFn({
                value: this.selected
            });
        }
    }

}
