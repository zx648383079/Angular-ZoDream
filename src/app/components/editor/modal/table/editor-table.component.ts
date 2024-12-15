import { Component } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
  selector: 'app-editor-table',
  templateUrl: './editor-table.component.html',
  styleUrls: ['./editor-table.component.scss']
})
export class EditorTableComponent implements IEditorModal {

    public visible = false;
    public columnItems: number[] = [];
    public rowItems: number[] = [];
    public column = 1;
    public row = 1;
    private confirmFn: EditorModalCallback;

    constructor() {
        this.columnItems = this.generateRange(10);
        this.rowItems = this.generateRange(2);
    }

    public tapCell(row: number, col: number) {
        this.column = col;
        this.row = row;
        if (row >= 9 && this.rowItems.length == 10) {
            return;
        }
        this.rowItems = this.generateRange(row + 1);
    }

    public tapConfirm(row: number, column: number) {
        this.visible = false;
        if (this.confirmFn) {
            this.confirmFn({
                row,
                column
            });
        }
    }

    public open(data: any, cb: EditorModalCallback) {
        this.visible = true;
        this.confirmFn = cb;
    }

    private generateRange(count: number): number[] {
        const items = [];
        for (let i = 1; i <= count; i++) {
            items.push(i);
        }
        return items;
    }
}
