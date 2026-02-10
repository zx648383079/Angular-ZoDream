import { Component, OnInit, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../model';
import { TvService } from '../tv.service';

@Component({
    standalone: false,
    selector: 'app-tv-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
    private readonly service = inject(TvService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);

    public readonly items = signal<ICategory[]>([]);
    public readonly isLoading = signal(false);

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                this.location.back();
                return;
            }
            this.load(param.id);
        });
    }

    private load(id: any) {
        this.isLoading.set(true);
        this.service.categoryList({
            id,
            extra: 'recommend,new'
        }).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.items.set(res.data);
            },
            error: err => {
                this.isLoading.set(false);
                this.location.back();
            }
        });
    }

}
