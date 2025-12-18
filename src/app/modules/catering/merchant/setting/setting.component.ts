import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../../../components/dialog';
import { CateringService } from '../../catering.service';
import { ICateringStore } from '../../model';
import { form } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {
    private readonly service = inject(CateringService);
    private readonly toastrService = inject(DialogService);


    public readonly dataForm = form(signal<ICateringStore>({
        name: '',
        logo: '',
        keywords: '',
        description: '',
        status: 0,
        open_status: 0,
        user_id: 0,
        address: '',
        is_open_live: 0,
        is_open_ship: 0,
        is_ship_self: 0,
        is_open_reserve: 0,
        reserve_time: 0,
    }));
    private isUpdated = false;
    private asyncTimer = 0;

    ngOnInit() {
        this.service.merchantSetting().subscribe(res => {
            this.dataForm().value.set(res);
        });
    }

    ngOnDestroy(): void {
        this.tapSubmit();
    }

    public uploadFile(event: any) {
        const files = event.target.files as FileList;
        this.service.merchantUploadLogo(files[0]).subscribe(res => {
            this.dataForm.logo().value.set(res.logo);
            this.toastrService.success($localize `Logo has been changed`);
        });
    }

    public toggleOpen() {
        this.dataForm.open_status().value.update(v => v > 0 ? 0 : 1);
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
        this.service.merchantSettingSave(this.dataForm().value()).subscribe({
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
