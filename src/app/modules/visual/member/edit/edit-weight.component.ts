import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ComponentTypeItems, ICategory, IThemeComponent } from '../../model';
import { VisualService } from '../visual.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent, UploadCustomEvent } from '../../../../components/form';
import { parseNumber } from '../../../../theme/utils';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-weight',
    templateUrl: './edit-weight.component.html',
    styleUrls: ['./edit-weight.component.scss']
})
export class EditWeightComponent implements OnInit {
    private readonly service = inject(VisualService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        thumb: '',
        keywords: '',
        description: '',
        cat_id: '',
        price: 0,
        type: '',
        path: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.cat_id);
    });
    public readonly filterCategories = computed(() => {
        const type = parseNumber(this.dataForm.type().value()) + 1;
        return this.categories.filter(i => i.id === type || i.parent_id === type);
    });
    private categories: ICategory[] = [];
    public typeItems = ComponentTypeItems;

    ngOnInit() {
        this.service.categoryTree().subscribe(res => {
            this.categories = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.component(params.id).subscribe({
                next: res => {
                    this.dataModel.set({
                        id: res.id,
                        name: res.name,
                        thumb: res.thumb,
                        keywords: res.keywords,
                        description: res.description,
                        cat_id: res.cat_id as any,
                        price: res.price,
                        type: res.type as any,
                        path: res.path
                    });
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
    }



    public tapBack() {
        history.back();
    }

    public onFileUpload(e: UploadCustomEvent) {
        this.service.upload(e.file).subscribe({
            next: res => {
                e.next(res);
            },
            error: err => {
                this.toastrService.error(err);
                e.next();
            }
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IThemeComponent = this.dataForm().value() as any;
        e?.enter();
        this.service.componentSave(data).subscribe({
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
