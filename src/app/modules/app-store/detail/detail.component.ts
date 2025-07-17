import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ThemeService } from '../../../theme/services';
import { AppStoreService } from '../app-store.service';
import { ISoftware, ISoftwarePackage } from '../model';

@Component({
    standalone: false,
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    public data: ISoftware;
    public currentPackage: ISoftwarePackage;
    public isLoading = false;
    public tabIndex = 0;

    constructor(
        private service: AppStoreService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private themeSerive: ThemeService,
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
        this.service.app(id).subscribe({
            next: res => {
                this.isLoading = false;
                this.themeSerive.titleChanged.next(res.name);
                this.data = res;
                this.currentPackage = this.findPackage(res.packages);
            },
            error: err => {
                this.isLoading = false;
                this.data = undefined;
                this.toastrService.error(err)
                history.back();
            }
        });
    }

    private findPackage(items: ISoftwarePackage[]): ISoftwarePackage|undefined {
        if (!items || items.length < 1) {
            return;
        }
        const agent = navigator.userAgent;
        for (const item of items) {
            if (agent.indexOf(item.os) > 0) {
                return item;
            }
        }
        return items[0];
    }

}
