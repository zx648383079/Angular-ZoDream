import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  public items = [1];

  constructor() { }

  ngOnInit() {
  }

}
