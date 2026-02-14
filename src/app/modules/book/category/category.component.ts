import { Component, inject } from '@angular/core';
import { ICategory } from '../model';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-book-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    private readonly service = inject(BookService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);


    public categories?: ICategory[] = [];

    constructor() {
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
