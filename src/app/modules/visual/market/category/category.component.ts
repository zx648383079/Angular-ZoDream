import { Component, OnInit } from '@angular/core';
import { VisualService } from '../visual.service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    
    public data: ICategory;
    public categories: ICategory[] = [];

    constructor(
        private service: VisualService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.service.category({
                id: params.id
            }).subscribe(res => {
                this.data = res;
                this.categories = res.children;
            });
        });
    }

}
