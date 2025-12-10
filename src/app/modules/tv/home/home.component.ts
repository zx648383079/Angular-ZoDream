import { Component, HostListener, OnInit, inject } from '@angular/core';
import { ICategory, IMovie } from '../model';
import { TvService } from '../tv.service';

@Component({
    standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private service = inject(TvService);


    public items: IMovie[] = [];
    public categories: ICategory[] = [];

    @HostListener('keydown', ['$event'])
    public onKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowDown') {
            
        }
    }

    ngOnInit() {
        this.service.categoryList({}).subscribe(res => {
            this.categories = res.data;
        });
        this.service.movieList({}).subscribe(res => {
            this.items = res.data;
        });
    }

}
