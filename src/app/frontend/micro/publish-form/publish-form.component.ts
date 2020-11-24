import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publish-form',
  templateUrl: './publish-form.component.html',
  styleUrls: ['./publish-form.component.scss']
})
export class PublishFormComponent {

    public fileItems = [
        'https://zodream.cn/assets/images/avatar/13.png'
    ];
    public content = '';

    constructor() { }

    public tapRemoveFile(i: number) {
        this.fileItems.splice(i, 1);
    }
}
