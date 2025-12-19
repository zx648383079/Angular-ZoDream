import { Component, OnInit, inject, signal } from '@angular/core';
import { ICateringStore } from '../../../model';
import { CateringBackendService } from '../../catering.service';
import { ButtonEvent } from '../../../../../components/form';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { FileUploadService } from '../../../../../theme/services';
import { IUser } from '../../../../../theme/models/user';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-catering-backend-edit-store',
    templateUrl: './edit-store.component.html',
    styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {
    private readonly service = inject(CateringBackendService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly uploadService = inject(FileUploadService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        keywords: '',
        description: '',
        logo: '',
        status: '',
        user: <IUser>null,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });
    public data: ICateringStore;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.store(params.id).subscribe({
                next: res => {
                    this.data = res;
                    this.dataModel.set({
                        id: res.id,
                        name: res.name,
                        keywords: res.keywords,
                        description: res.description,
                        logo: res.logo,
                        status: '',
                        user: res.user ?? null
                    });
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ICateringStore = this.dataForm().value() as any;
        if (data.user) {
            data.user_id = data.user.id;
        }
        e?.enter();
        this.service.storeSave({...data, user: undefined}).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success($localize `Save Successfully`);
                history.back();
            },
            error: err => {
                this.toastrService.error(err);
                e?.reset();
            }
        });
    }
}
