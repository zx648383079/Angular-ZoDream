import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ThemeService } from '../../../theme/services';
import { mapFormat, parseNumber } from '../../../theme/utils';
import { FileTypeItems, IResource, IResourceCatalog } from '../model';
import { ResourceService } from '../resource.service';

@Component({
    standalone: false,
    selector: 'app-res-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    private readonly service = inject(ResourceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public readonly data = signal<IResource>(null);
    public readonly isLoading = signal(false);
    public readonly tabIndex = signal(0);
    public readonly catalogItems = signal<IResourceCatalog[]>([]);

    ngOnInit() {
        this.route.params.subscribe(param => {
            if (!param.id) {
                history.back();
                return;
            }
            this.load(param.id);
        });
    }

    public formatType(val: any) {
        return mapFormat(val, FileTypeItems);
    }

    private load(id: any) {
        this.isLoading.set(true);
        this.service.resource(id).subscribe({
            next: res => {
                this.isLoading.set(false);
                res.score = parseNumber(res.score);
                this.themeService.titleChanged.next(res.title);
                this.data.set(res);
                this.catalogItems.set(res.file_catalog);
                // this.loadCatalog();
            },
            error: err => {
                this.isLoading.set(false);
                this.data.set(null);
                this.toastrService.error(err)
                history.back();
            }
        });
    }

    public tapCollect() {
        if (!this.data()) {
            return;
        }
        this.service.collect(this.data().id).subscribe({
            next: res => {
                this.data.update(v => {
                    return {...v, is_collected: res.is_collected, collect_count: res.collect_count};
                });
            }, error: err => {
                this.toastrService.warning(err);
            }
        });
    }

    private loadCatalog() {
        this.service.resourceCatalog(this.data().id).subscribe(res => {
            this.catalogItems.set(res.data);
        });
    }

 

}
