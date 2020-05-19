import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public items = [
    {
      id: 1,
      name: '1111',
      children: [
        1,
        2
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
