import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IMovie, IMovieSeries } from '../model';
import { TvService } from '../tv.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: IMovie;
    public seriesItems: IMovieSeries[] = [];
    public items: IMovie[] = [];
    public isLoading = false;

    constructor(
        private service: TvService,
        private toastrService: DialogService,
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
        this.service.movieList({}).subscribe(res => {
            this.items = res.data;
        });
    }


    private load(id: any) {
        this.isLoading = true;
        this.service.movie(id).subscribe({
            next: res => {
                this.isLoading = false;
                this.data = res;
            },
            error: err => {
                this.isLoading = false;
                this.toastrService.error(err);
                this.data = undefined;
                history.back();
            }
        });
    }
}
