import { Component, OnInit } from '@angular/core';
import { ICommandManager } from '../command';
import { EditorService } from '../editor.service';
import { PanelWidget } from '../model';
import { isMergeable, isSplitable } from '../util';

@Component({
  selector: 'app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss']
})
export class EditorToolBarComponent {

    public canForward = false;
    public canBack = false;
    public canMerge = false;
    public canSplit = false;

    private commandManager: ICommandManager;

    constructor(
        private readonly service: EditorService,
    ) {
        this.commandManager = this.service.commandManager;
        this.commandManager.$undoStateChanged.subscribe(res => {
            this.canBack = res;
        });
        this.commandManager.$reverseUndoStateChanged.subscribe(res => {
            this.canForward = res;
        });
        this.service.selectionChanged$.subscribe(res => {
            this.canMerge = isMergeable(res);
            this.canSplit = isSplitable(res);
        });
    }

    public tapBack() {
        if (!this.canBack) {
            return;
        }
        this.commandManager.undo();
    }
    public tapForward() {
        if (!this.canForward) {
            return;
        }
        this.commandManager.reverseUndo();
    }

    public tapZIndex(i: number) {

    }

    public tapAlign(i: number) {
        
    }
}
