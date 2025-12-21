import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { IMovie, IMovieSeries } from '../model';
import { TvService } from '../tv.service';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(TvService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);


    public readonly data =signal<IMovie>(null);
    public readonly seriesItems = signal<IMovieSeries[]>([]);
    public readonly items = signal<IMovie[]>([]);
    public readonly isLoading = signal(false);

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                history.back();
                return;
            }
            this.load(param.id);
        });
        this.service.movieList({}).subscribe(res => {
            this.items.set(res.data);
        });
    }


    private load(id: any) {
        this.isLoading.set(true);
        this.service.movie(id).subscribe({
            next: res => {
                this.isLoading.set(false);
                this.data.set(res);
            },
            error: err => {
                this.isLoading.set(false);
                this.toastrService.error(err);
                this.data.set(null);
                history.back();
            }
        });
    }
}
