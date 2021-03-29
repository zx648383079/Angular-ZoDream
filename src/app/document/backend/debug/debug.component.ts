import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

    public methodItems = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];
    public requestIndex = 0;

    constructor() { }

    ngOnInit() {
    }

}
