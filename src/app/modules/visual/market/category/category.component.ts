import { Component, inject } from '@angular/core';
import { VisualService } from '../visual.service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../model';

@Component({
    standalone: false,
    selector: 'app-vis-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    private readonly service = inject(VisualService);
    private readonly route = inject(ActivatedRoute);


    
    public data: ICategory;
    public categories: ICategory[] = [];

    constructor() {
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
