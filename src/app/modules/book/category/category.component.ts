import { Component, OnInit } from '@angular/core';
import { ICategory } from '../model';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public categories?: ICategory[] = [];

    constructor(
        private service: BookService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.service.getCategories().subscribe(res => {
            this.categories = res;
        });
    }

    public tapCategory(item: ICategory) {
        this.router.navigate(['../top'], {
            queryParams: {
                category: item.id,
                title: item.name,
            },
            relativeTo: this.route,
        });
    }
}
