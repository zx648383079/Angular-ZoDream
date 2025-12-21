import { Component, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';
import { IEditorOptionItem } from '../../base';

@Component({
    standalone: false,
    selector: 'app-editor-search',
    templateUrl: './editor-search.component.html',
    styleUrls: ['./editor-search.component.scss']
})
export class EditorSearchComponent implements IEditorModal {

    public readonly visible = signal(false);
    public keywords = '';
    public readonly items = signal<IEditorOptionItem[]>([]);
    public selectedItems: IEditorOptionItem[] = [];
    private multiple = true;
    private confirmFn: EditorModalCallback;

    public isSelected(item: IEditorOptionItem) {
        for (const it of this.selectedItems) {
            if (this.isSame(it, item)) {
                return true;
            }
        }
        return false;
    }

    public tapSelect(item: IEditorOptionItem) {
        if (!this.multiple) {
            this.selectedItems = [item];
            this.keywords = '';
            this.visible.set(false);
            this.tapConfirm();
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (this.isSame(item, this.selectedItems[i])) {
                this.selectedItems.splice(i, 1);
                return;
            }
        }
        this.selectedItems.push(item);
    }

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
        this.confirmFn = cb;
    }

    public tapConfirm() {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn(this.selectedItems);
        }
    }

    private isSame(data: IEditorOptionItem, target: IEditorOptionItem) {
        return data.value === target.value;
    }
}
