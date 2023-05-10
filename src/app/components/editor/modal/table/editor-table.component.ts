import { Component } from '@angular/core';

@Component({
  selector: 'app-editor-table',
  templateUrl: './editor-table.component.html',
  styleUrls: ['./editor-table.component.scss']
})
export class EditorTableComponent {

    public columnItems: number[] = [];
    public rowItems: number[] = [];
    public column = 1;
    public row = 1;

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

    public tapConfirm(row: number, col: number) {

    }

    private generateRange(count: number): number[] {
        const items = [];
        for (let i = 1; i <= count; i++) {
            items.push(i);
        }
        return items;
    }
}
