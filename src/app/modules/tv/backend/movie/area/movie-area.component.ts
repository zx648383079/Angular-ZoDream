import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { IPageQueries } from '../../../../../theme/models/page';
import { SearchService } from '../../../../../theme/services';
import { emptyValidate } from '../../../../../theme/validators';
import { IMovieArea } from '../../../model';
import { TVService } from '../../tv.service';

@Component({
    standalone: false,
  selector: 'app-movie-area',
  templateUrl: './movie-area.component.html',
  styleUrls: ['./movie-area.component.scss']
})
export class MovieAreaComponent implements OnInit {
    private service = inject(TVService);
    private toastrService = inject(DialogService);
    private route = inject(ActivatedRoute);
    private searchService = inject(SearchService);


    public items: IMovieArea[] = [];
    public isLoading = false;
    public editData: IMovieArea = {} as any;

    ngOnInit() {
        this.load()
    }

    public load() {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.service.areaList().subscribe({
            next: res => {
                this.items = res.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    public open(modal: DialogEvent, item?: IMovieArea) {
        this.editData = item ? Object.assign({}, item) : {
            id: 0,
            name: '',
        };
        modal.open(() => {
            this.service.areaSave(this.editData).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.load();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => {
            return !emptyValidate(this.editData.name);
        });
    }

    public tapRemove(item: IMovieArea) {
        this.toastrService.confirm('确定删除“' + item.name + '”地区？', () => {
            this.service.areaRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items = this.items.filter(it => {
                    return it.id !== item.id;
                });
            });
        })
    }


}
