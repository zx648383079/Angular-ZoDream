import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-editor-property',
  templateUrl: './editor-property.component.html',
  styleUrls: ['./editor-property.component.scss']
})
export class EditorPropertyComponent implements OnInit {

    public panelToggle: any = {
        
    };

    public panelVisible = false;

    constructor(
        private service: EditorService,
    ) { }


    public ngOnInit() {
        this.service.editWidget$.subscribe(res => {
            if (!res) {
                this.panelVisible = false;
                return;
            }
            this.panelVisible = true;
        });
    }

    public tapClose(e: MouseEvent) {
        e.stopPropagation();
        this.panelVisible = false;
    }

}
