import { Component, HostListener, inject, signal } from '@angular/core';
import { ICategory, IMovie } from '../model';
import { TvService } from '../tv.service';

@Component({
    standalone: false,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private readonly service = inject(TvService);


    public readonly items = signal<IMovie[]>([]);
    public readonly categories = signal<ICategory[]>([]);

    @HostListener('keydown', ['$event'])
    public onKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowDown') {
            
        }
    }

    constructor() {
        this.service.categoryList({}).subscribe(res => {
            this.categories.set(res.data);
        });
        this.service.movieList({}).subscribe(res => {
            this.items.set(res.data);
        });
    }

}
