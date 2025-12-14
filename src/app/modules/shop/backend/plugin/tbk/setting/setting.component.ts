import { Component, OnInit, inject } from '@angular/core';
import { DialogService } from '../../../../../../components/dialog';
import { ButtonEvent } from '../../../../../../components/form';
import { TbkService } from '../tbk.service';

@Component({
    standalone: false,
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
    private readonly service = inject(TbkService);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        app_key: '',
        secret: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.app_key);
        required(schemaPath.secret);
    });

    ngOnInit() {
        this.service.option().subscribe(res => {
            this.dataModel.set({
                        id: res.id,
                app_key: res.data.app_key,
                secret: res.data.secret
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: any = this.dataForm().value();
        e?.enter();
        this.service.optionSave(data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Save Successfully`);
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
