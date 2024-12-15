import { Component } from '@angular/core';
import { ALIGN_ACTION, IWorkEditor, MENU_ACTION } from '../model';
import { EditorService } from '../editor.service';
import { isMergeable, isSplitable, parseEnum } from '../util';

@Component({
    standalone: false,
  selector: 'app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss']
})
export class EditorToolBarComponent {

    public canForward = false;
    public canBack = false;
    public canMerge = false;
    public canSplit = false;
    public isSelection = false;

    private editor: IWorkEditor;

    constructor(
        private readonly service: EditorService,
    ) {
        this.editor = this.service.workspace;
        this.editor.$undoStateChanged.subscribe(res => {
            this.canBack = res;
        });
        this.editor.$reverseUndoStateChanged.subscribe(res => {
            this.canForward = res;
        });
        this.service.selectionChanged$.subscribe(res => {
            this.canMerge = isMergeable(res);
            this.canSplit = isSplitable(res);
            this.isSelection = res.length > 0;
        });
    }

    public tapBack() {
        if (!this.canBack) {
            return;
        }
        this.editor.execute(MENU_ACTION.BACK);
    }
    public tapForward() {
        if (!this.canForward) {
            return;
        }
        this.editor.execute(MENU_ACTION.FORWARD);
    }

    public tapAction(i: number, enable = true) {
        if (!enable) {
            return;
        }
        this.editor.execute(parseEnum<MENU_ACTION>(i, MENU_ACTION));
    }

    public tapZIndex(i: number) {
        if (!this.isSelection) {
            return;
        }
        this.editor.execute(parseEnum<MENU_ACTION>(i, MENU_ACTION));
    }

    public tapAlign(i: number) {
        if (!this.isSelection) {
            return;
        }
        this.editor.execute({
            action: MENU_ACTION.ALIGN,
            data: parseEnum<ALIGN_ACTION>(i, ALIGN_ACTION)
        });
    }
}
