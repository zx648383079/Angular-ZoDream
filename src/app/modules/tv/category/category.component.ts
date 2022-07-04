import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../model';
import { TvService } from '../tv.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    public items: ICategory[] = [];
    public isLoading = false;

    constructor(
        private service: TvService,
        private route: ActivatedRoute,
    ) { }

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
