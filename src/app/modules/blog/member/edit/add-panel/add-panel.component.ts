import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-blog-add-panel',
    templateUrl: './add-panel.component.html',
    styleUrls: ['./add-panel.component.scss'],
})
export class AddPanelComponent {

    @Input() public visible = false;
    public tabIndex = 0;
    public tabItems = ['组件', '模板', '资源'];

    constructor() { }

}
