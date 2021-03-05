import { Component } from '@angular/core';

@Component({
  selector: 'app-online-service',
  templateUrl: './online-service.component.html',
  styleUrls: ['./online-service.component.scss']
})
export class OnlineServiceComponent {

    public dialogOpen = false;
    public content = '';
    public items: any[] = [];
    public currentId = 0;

    constructor() { }

    public tapSend() {

    }

    public tapUploadImage(event: any) {

    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.code !== 'Enter') {
            return;
        }
        this.tapSend();
    }

    public tapMore() {

    }
}
