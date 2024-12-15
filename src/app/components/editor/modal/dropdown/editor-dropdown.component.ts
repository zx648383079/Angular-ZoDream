import { Component } from '@angular/core';
import { EditorModalCallback, IEditorSharedModal } from '../../model';
import { IEditorModule, IEditorOptionItem } from '../../base';
import { IPoint } from '../../../../theme/utils/canvas';


const FontItems: IEditorOptionItem[] = [
    {
        name: 'Arial',
        value: 'Arial,Helvetica,sans-serif',
    },
    {
        name: 'Georgia',
        value: 'Georgia,serif',
    },
    {
        name: 'Impact',
        value: 'Impact,Charcoal,sans-serif',
    },
    {
        name: '微软雅黑',
        value: '微软雅黑,sans-serif',
    },
    {
        name: '宋体',
        value: 'serif',
    },
    {
        name: '黑体',
        value: 'sans-serif',
    }
]

@Component({
    standalone: false,
  selector: 'app-editor-dropdown',
  templateUrl: './editor-dropdown.component.html',
  styleUrls: ['./editor-dropdown.component.scss']
})
export class EditorDropdownComponent implements IEditorSharedModal {

    public visible = false;
    public items: IEditorOptionItem[] = [];
    public selected = '';
    public modalStyle: any = {};
    private confirmFn: EditorModalCallback;

    constructor() {
    }

    public modalReady(module: IEditorModule) {
        if (module.name === 'font') {
            this.items = FontItems.map(i => {
                i.style = {
                    'font-family': i.value
                };
                return i;
            });
            return;
        } else if (module.name === 'fontsize') {
            const items = [];
            let last = 7;
            let step = 1;
            for (let i = 0; i < 16; i++) {
                if (i > 0 && i % 3 === 0) {
                    step *= 2;
                }
                const value = last + step;
                items.push({
                    name: value,
                    value,
                });
                last = value;
            }
            this.items = items;
            return;
        }
    }

    public open(data: any, cb: EditorModalCallback, position?: IPoint) {
        this.modalStyle = position ? {left: position.x + 'px', top: position.y + 'px'} : {};
        this.visible = true;
        this.confirmFn = cb;
    }

    public tapConfirm(item: IEditorOptionItem) {
        this.visible = false;
        this.selected = item.value;
        if (this.confirmFn) {
            this.confirmFn({
                value: this.selected
            });
        }
    }

}
