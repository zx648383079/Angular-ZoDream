import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory, IResource } from '../model';
import { ResourceService } from '../resource.service';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-res-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(ResourceService);

    public readonly queries = form(signal({
        keywords: '',
    }));


    public categories: ICategory[] = [];
    public featureItems: IResource[] = [];
    public featureLoading = true;
    public newItems: IResource[] = [];
    public newLoading = true;

    ngOnInit() {
        this.service.batch({
            recommend: {
                extra: 'items'
            }
        }).subscribe(res => {
            this.categories = res.recommend;
        })
    }

    public tapSearch(e: Event) {
        e.preventDefault();
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: this.queries().value()});
    }


    public loadFeature() {
        this.featureLoading = true;
        this.service.resourceList({
            sort: 'hot',
            per_page: 4
        }).subscribe({
            next: res => {
                this.featureItems = res.data;
                this.featureLoading = false;
            },
            error: _ => {
                this.featureLoading = false;
            }
        });
    }

    public loadNewest() {
        this.newLoading = true;
        this.service.resourceList({
            sort: 'new',
            per_page: 12
        }).subscribe({
            next: res => {
                this.newItems = res.data;
                this.newLoading = false;
            },
            error: _ => {
                this.newLoading = false;
            }
        });
    }
}
