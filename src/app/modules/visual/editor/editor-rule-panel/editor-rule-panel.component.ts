import { Component, NgZone, inject, input, signal, viewChild } from '@angular/core';
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
    private readonly service = inject(EditorService);

    public readonly contextMenu = viewChild(ContextMenuComponent);
    public readonly offsetX = input(0);
    public readonly offsetY = input(0);
    public readonly scale = input(1);
    public readonly tempLine = signal<IRuleLine|null>(null);
    public readonly hLines = signal<IRuleLine[]>([]);
    public readonly vLines = signal<IRuleLine[]>([]);
    public readonly lineVisible = signal(true);

    public tapIcon(event: MouseEvent) {
        this.contextMenu()!.open(event, [
            {
                name: this.lineVisible() ? '隐藏辅助线' : '显示辅助线',
                icon: this.lineVisible() ? 'icon-eye-slash' : 'icon-eye',
                onTapped: () => {
                    this.lineVisible.update(v => !v);
                }
            },
            {
                name: '清空辅助线',
                icon: 'icon-trash',
                onTapped: () => {
                    this.vLines.set([]);
                    this.hLines.set([]);
                }
            }
        ]);
    }


    public tapBar(event: IRuleLine) {
        const res = this.service.workspaceSize$.value;
        if (!res) {
            return;
        }
        this.lineVisible.set(true);
        if (event.horizontal) {
            this.hLines.update(v => [...v, event]);
            return;
        }
        this.vLines.update(v => [...v, event]);
    }

    public tapRemoveLine(i: number, horizontal: boolean, event: MouseEvent) {
        event.stopPropagation();
        if (horizontal) {
            this.hLines.update(v => v.filter((_, j) => j !== i));
        } else {
            this.vLines.update(v => v.filter((_, j) => j !== i));
        }
    }

    public onLineEnd() {
        this.tempLine.set(null);
    }

    public onLineMove(event: IRuleLine) {
        const res = this.service.workspaceSize$.value;
        if (!res) {
            return;
        }
        if (event.horizontal) {
            this.tempLine.set(event);
            return;
        }
        this.tempLine.set(event);
    }

}
