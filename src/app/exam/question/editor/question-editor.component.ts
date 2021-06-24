import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss']
})
export class QuestionEditorComponent implements OnInit {

    @Input() public editable = true;

    public opitonItems = [
        {content: '对', checked: false},
        {content: '错', checked: false}
    ];

    constructor() { }

    ngOnInit() {
    }

    public tapSelected(i: number) {
        const item = this.opitonItems[i];
        item.checked = !item.checked;
    }

    public tapAddOption() {
        this.opitonItems.push({
            content: '无',
            checked: false
        });
    }

    public tapUpload() {
        
    }
}
