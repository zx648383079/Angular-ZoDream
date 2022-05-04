import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shortcut-info',
  templateUrl: './shortcut-info.component.html',
  styleUrls: ['./shortcut-info.component.scss']
})
export class ShortcutInfoComponent implements OnInit {

    public isMac = false;

    constructor() { }

    ngOnInit() {
        this.isMac = navigator.userAgent.indexOf('Mac') >= 0;
    }
}
