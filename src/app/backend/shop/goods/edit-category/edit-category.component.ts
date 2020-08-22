import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../../../theme/models/shop';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  public data: ICategory;

  constructor() { }

  ngOnInit() {
  }

}
