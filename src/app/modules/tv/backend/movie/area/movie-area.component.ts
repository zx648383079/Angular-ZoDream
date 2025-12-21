import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogEvent, DialogService } from '../../../../../components/dialog';
import { SearchService } from '../../../../../theme/services';
import { IMovieArea } from '../../../model';
import { TVService } from '../../tv.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-movie-area',
    templateUrl: './movie-area.component.html',
    styleUrls: ['./movie-area.component.scss']
})
export class MovieAreaComponent implements OnInit {
    private readonly service = inject(TVService);
    private readonly toastrService = inject(DialogService);
    private readonly route = inject(ActivatedRoute);
    private readonly searchService = inject(SearchService);


    public readonly items = signal<IMovieArea[]>([]);
    public readonly isLoading = signal(false);
    public readonly editForm = form(signal<IMovieArea>({
        id: 0,
        name: '',
    }), schemaPath => {
        required(schemaPath.name);
    });

    ngOnInit() {
        this.load()
    }

    public load() {
        if (this.isLoading) {
            return;
        }
        this.isLoading.set(true);
        this.service.areaList().subscribe({
            next: res => {
                this.items.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    public open(modal: DialogEvent, item?: IMovieArea) {
        this.editForm().value.update(v => {
            v.id = item?.id ?? 0;
            v.name = item?.name ?? '';
            return v;
        });
        modal.open(() => {
            this.service.areaSave(this.editForm().value()).subscribe({
                next: () => {
                    this.toastrService.success($localize `Save Successfully`);
                    this.load();
                },
                error: err => {
                    this.toastrService.error(err);
                }
            });
        }, () => this.editForm().valid());
    }

    public tapRemove(item: IMovieArea) {
        this.toastrService.confirm('确定删除“' + item.name + '”地区？', () => {
            this.service.areaRemove(item.id).subscribe(res => {
                if (!res.data) {
                    return;
                }
                this.toastrService.success($localize `Delete Successfully`);
                this.items.update(v => {
                    return v.filter(it => {
                        return it.id !== item.id;
                    });
                });
            });
        })
    }


}
