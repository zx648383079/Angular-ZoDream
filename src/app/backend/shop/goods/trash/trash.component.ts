import { Component, OnInit } from '@angular/core';
import { IProduct } from '../model';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  public items: IProduct[] = [];

  constructor() { }

  ngOnInit() {
  }

}
