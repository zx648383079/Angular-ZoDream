import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStoreService } from '../app-store.service';
import { ICategory, ISoftware } from '../model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public categories: ICategory[] = [];
    public featureItems: ISoftware[] = [];
    public featureLoading = true;
    public newItems: ISoftware[] = [];
    public newLoading = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private service: AppStoreService,
    ) { }

    ngOnInit() {
        this.service.batch({
            recommend: {
                extra: 'items'
            }
        }).subscribe(res => {
            this.categories = res.recommend;
        })
    }

    public tapSearch(form: any) {
        this.router.navigate(['search'], {relativeTo: this.route, queryParams: form});
    }


    public loadFeature() {
        this.featureLoading = true;
        this.service.appList({
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
        this.service.appList({
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
