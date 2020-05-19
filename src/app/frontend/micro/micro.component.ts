import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-micro',
  templateUrl: './micro.component.html',
  styleUrls: ['./micro.component.scss']
})
export class MicroComponent implements OnInit {

  public items = [1];

  constructor() { }

  ngOnInit(): void {
  }

}
