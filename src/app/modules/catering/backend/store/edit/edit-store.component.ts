import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICateringStore } from '../../../model';
import { CateringBackendService } from '../../catering.service';
import { ButtonEvent } from '../../../../../components/form';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { FileUploadService } from '../../../../../theme/services';
import { IUser } from '../../../../../theme/models/user';

@Component({
    standalone: false,
    selector: 'app-catering-backend-edit-store',
    templateUrl: './edit-store.component.html',
    styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(CateringBackendService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);
    private uploadService = inject(FileUploadService);


    public form = this.fb.group({
        name: ['', Validators.required],
        keywords: [''],
        description: [''],
        logo: [''],
        status: [0],
    });
    public data: ICateringStore;
    public user: IUser;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.store(params.id).subscribe({
                next: res => {
                    this.data = res;
                    this.user = res.user;
                    this.form.patchValue({
                        name: res.name,
                        keywords: res.keywords,
                        description: res.description,
                        logo: res.logo
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
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ICateringStore = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        if (this.user) {
            data.user_id = this.user.id;
        }
        e?.enter();
        this.service.storeSave(data).subscribe({
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
