import { Component } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-shortcut-info',
    templateUrl: './shortcut-info.component.html',
    styleUrls: ['./shortcut-info.component.scss']
})
export class ShortcutInfoComponent {

    public readonly isMac = navigator.userAgent.indexOf('Mac') >= 0;
}
