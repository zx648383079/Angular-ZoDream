import { Component, OnInit } from '@angular/core';
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

    public items: ICategory[] = [];
    public isLoading = false;

    constructor(
        private service: BlogService,
        private themeService: ThemeService,
    ) {
        this.themeService.setTitle($localize `Categories`);
        this.service.getCategories().subscribe(res => {
            this.items = res;
        });
    }

    ngOnInit() {
    }

}
