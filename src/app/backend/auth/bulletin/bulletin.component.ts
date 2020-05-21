import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.scss']
})
export class BulletinComponent implements OnInit {

  public items = [1];

  constructor() { }

  ngOnInit() {
  }

}
