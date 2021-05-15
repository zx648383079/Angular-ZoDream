import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shortcut-info',
  templateUrl: './shortcut-info.component.html',
  styleUrls: ['./shortcut-info.component.scss']
})
export class ShortcutInfoComponent implements OnInit {

    public osVersion: 'Mac' | 'Windows';

    constructor() { }

    ngOnInit() {
        const _nav = navigator.appVersion;
        if (_nav.includes('Mac')) {
            this.osVersion = 'Mac';
        } else if (_nav.includes('Windows')) {
            this.osVersion = 'Windows';
        }
    }
}
