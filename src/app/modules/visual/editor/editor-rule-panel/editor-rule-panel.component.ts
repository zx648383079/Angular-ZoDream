import { Component, Input, NgZone, ViewChild } from '@angular/core';
import { ContextMenuComponent } from '../../../../components/context-menu';
import { EditorService } from '../editor.service';
import { IRuleLine } from '../model';

@Component({
    standalone: false,
  selector: 'app-editor-rule-panel',
  templateUrl: './editor-rule-panel.component.html',
  styleUrls: ['./editor-rule-panel.component.scss']
})
export class EditorRulePanelComponent {
    @ViewChild(ContextMenuComponent)
    public contextMenu: ContextMenuComponent;
    @Input() public offsetX = 0;
    @Input() public offsetY = 0;
    @Input() public scale = 1;
    public tempLine: IRuleLine;
    public hLines: IRuleLine[] = [];
    public vLines: IRuleLine[] = [];
    public lineVisible = true;


    constructor(
        private readonly zone: NgZone,
        private readonly service: EditorService,
    ) {
    }

    public tapIcon(event: MouseEvent) {
        this.contextMenu.show(event, [
            {
                name: this.lineVisible ? '隐藏辅助线' : '显示辅助线',
                icon: this.lineVisible ? 'icon-eye-slash' : 'icon-eye',
                onTapped: () => {
                    this.lineVisible = !this.lineVisible;
                }
            },
            {
                name: '清空辅助线',
                icon: 'icon-trash',
                onTapped: () => {
                    this.vLines = [];
                    this.hLines = [];
                }
            }
        ]);
    }


    public tapBar(event: IRuleLine) {
        const res = this.service.workspaceSize$.value;
        if (!res) {
            return;
        }
        this.lineVisible = true;
        if (event.horizontal) {
            this.hLines.push(event);
            return;
        }
        this.vLines.push(event);
    }

    public tapRemoveLine(i: number, horizontal: boolean, event: MouseEvent) {
        event.stopPropagation();
        if (horizontal) {
            this.hLines.splice(i, 1);
        } else {
            this.vLines.splice(i, 1);
        }
    }

    public onLineEnd() {
        this.tempLine = undefined;
    }

    public onLineMove(event: IRuleLine) {
        const res = this.service.workspaceSize$.value;
        if (!res) {
            return;
        }
        if (event.horizontal) {
            this.tempLine = event;
            return;
        }
        this.tempLine = event;
    }

}
