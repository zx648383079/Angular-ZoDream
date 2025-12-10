import { Component, OnInit, inject } from '@angular/core';
import { VisualService } from '../visual.service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../model';

@Component({
    standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private service = inject(VisualService);
    private route = inject(ActivatedRoute);


    
    public data: ICategory;
    public categories: ICategory[] = [];

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
