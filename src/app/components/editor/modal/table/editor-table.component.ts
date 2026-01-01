import { Component, signal } from '@angular/core';
import { EditorModalCallback, IEditorModal } from '../../model';

@Component({
    standalone: false,
    selector: 'app-editor-table',
    templateUrl: './editor-table.component.html',
    styleUrls: ['./editor-table.component.scss']
})
export class EditorTableComponent implements IEditorModal {

    public readonly visible = signal(false);
    public columnItems: number[] = [];
    public rowItems: number[] = [];
    public readonly column = signal(1);
    public readonly row = signal(1);
    private confirmFn: EditorModalCallback;

    constructor() {
        this.columnItems = this.generateRange(10);
        this.rowItems = this.generateRange(2);
    }

    public tapCell(row: number, col: number) {
        this.column.set(col);
        this.row.set(row);
        if (row >= 9 && this.rowItems.length == 10) {
            return;
        }
        this.rowItems = this.generateRange(row + 1);
    }

    public tapConfirm(row: number, column: number) {
        this.visible.set(false);
        if (this.confirmFn) {
            this.confirmFn({
                row,
                column
            });
        }
    }

    public open(data: any, cb: EditorModalCallback) {
        this.visible.set(true);
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
