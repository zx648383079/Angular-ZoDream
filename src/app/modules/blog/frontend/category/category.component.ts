import { Component, inject, signal } from '@angular/core';
import { BlogService } from '../blog.service';
import { ICategory } from '../../model';
import { ThemeService } from '../../../../theme/services';

@Component({
    standalone: false,
    selector: 'app-blog-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    private readonly service = inject(BlogService);
    private readonly themeService = inject(ThemeService);


    public readonly items = signal<ICategory[]>([]);
    public readonly isLoading = signal(false);

    constructor() {
        this.themeService.titleChanged.next($localize `Categories`);
        this.service.getCategories().subscribe(res => {
            this.items.set(res);
        });
    }

}
