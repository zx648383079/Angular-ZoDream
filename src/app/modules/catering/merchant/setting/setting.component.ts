import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { CateringService } from '../../catering.service';
import { ICateringStore } from '../../model';

@Component({
    standalone: false,
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {

    public data: ICateringStore;
    private isUpdated = false;
    private asyncTimer = 0;

    constructor(
        private service: CateringService,
        private toastrService: DialogService,
    ) { }

    ngOnInit() {
        this.service.merchantSetting().subscribe(res => {
            this.data = res;
        });
    }

    ngOnDestroy(): void {
        this.tapSubmit();
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.service.merchantUploadLogo(files[0]).subscribe(res => {
            this.data.logo = res.logo;
            this.toastrService.success($localize `Logo has been changed`);
        });
    }

    public toggleOpen() {
        this.data.open_status = this.data.open_status > 0 ? 0 : 1;
        this.asynSave();
    }

    public onValueChange() {
        this.asynSave();
    }

    public asynSave() {
        this.isUpdated = true;
        if (this.asyncTimer > 0) {
            clearTimeout(this.asyncTimer);
        }
        this.asyncTimer = window.setTimeout(() => {
            this.asyncTimer = 0;
            this.tapSubmit();
        }, 2000);
    }

    public tapSubmit() {
        if (!this.isUpdated) {
            return;
        }
        if (this.asyncTimer > 0) {
            clearTimeout(this.asyncTimer);
        }
        this.isUpdated = false;
        this.service.merchantSettingSave(this.data).subscribe({
            next: res => {
                this.toastrService.success($localize `Save Successfully`);
            },
            error: err => {
                this.isUpdated = true;
                this.toastrService.error(err);
            }
        });
    }

}
