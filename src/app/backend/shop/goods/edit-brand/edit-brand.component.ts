import { Component, OnInit } from '@angular/core';
import { IBrand } from '../../../../theme/models/shop';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {

  public data: IBrand;

  constructor() { }

  ngOnInit() {
  }

}
