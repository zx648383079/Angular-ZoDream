import { Component, OnInit, inject } from '@angular/core';
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
    private service = inject(BookService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);


    public categories?: ICategory[] = [];

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
