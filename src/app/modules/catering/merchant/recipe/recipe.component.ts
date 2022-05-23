import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeDialogComponent } from './dialog/recipe-dialog.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

    @ViewChild(RecipeDialogComponent)
    public modal: RecipeDialogComponent;

    constructor() { }

    ngOnInit() {
    }

}
