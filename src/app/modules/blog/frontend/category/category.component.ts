import { Component, OnInit, inject } from '@angular/core';
import { BlogService } from '../blog.service';
import { ICategory } from '../../model';
import { ThemeService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private service = inject(BlogService);
    private themeService = inject(ThemeService);


    public items: ICategory[] = [];
    public isLoading = false;

    constructor() {
        this.themeService.titleChanged.next($localize `Categories`);
        this.service.getCategories().subscribe(res => {
            this.items = res;
        });
    }

    ngOnInit() {
    }

}
