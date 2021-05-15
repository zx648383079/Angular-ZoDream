import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';

enum EditMode {
    NONE,
    HOVER,
    EDIT,
}

@Component({
  selector: 'app-editor-reflection',
  templateUrl: './editor-reflection.component.html',
  styleUrls: ['./editor-reflection.component.scss']
})
export class EditorReflectionComponent implements OnInit {

    public mode = EditMode.NONE;

    public get boxStyle() {
        return {
            left: 0 + 'px',
            top: 0 + 'px',
            width: 0 + 'px',
            height: 0 + 'px',
        };
    }

    public get boxCls() {
        if (this.mode === EditMode.EDIT) {
            return 'edit-in';
        }
        if (this.mode === EditMode.HOVER) {
            return 'edit-hover';
        }
        return 'edit-hide';
    }

    constructor(
        private service: EditorService,
    ) { }

    ngOnInit() {
        this.service.editWidget$.subscribe(res => {
            if (!res) {
                this.mode = EditMode.NONE;
                return;
            }
            this.mode = EditMode.HOVER;
        });
    }

}
