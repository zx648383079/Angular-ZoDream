import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../model';
import { TvService } from '../tv.service';

@Component({
    standalone: false,
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private service = inject(TvService);
    private route = inject(ActivatedRoute);


    public items: ICategory[] = [];
    public isLoading = false;

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                history.back();
                return;
            }
            this.load(param.id);
        });
    }

    private load(id: any) {
        this.isLoading = true;
        this.service.categoryList({
            id,
            extra: 'recommend,new'
        }).subscribe({
            next: res => {
                this.isLoading = false;
                this.items = res.data;
            },
            error: err => {
                this.isLoading = false;
                history.back();
            }
        });
    }

}
