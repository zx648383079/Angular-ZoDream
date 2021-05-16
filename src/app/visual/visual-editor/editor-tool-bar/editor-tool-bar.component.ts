import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss']
})
export class EditorToolBarComponent implements OnInit {

    public canForward = false;
    public canBack = false;

    constructor(
        private readonly service: EditorService,
    ) { }

    ngOnInit() {
        this.service.histories.action$.subscribe(() => {
            this.canBack = this.service.histories.canBack();
            this.canForward = this.service.histories.canForward();
        });
    }

}
