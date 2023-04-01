import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICategory, IThemeComponent, ComponentTypeItems } from '../../../model';
import { VisualService } from '../../visual.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ButtonEvent, UploadCustomEvent } from '../../../../../components/form';
import { parseNumber } from '../../../../../theme/utils';

@Component({
    selector: 'app-edit-weight',
    templateUrl: './edit-weight.component.html',
    styleUrls: ['./edit-weight.component.scss']
})
export class EditWeightComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        thumb: [''],
        keywords: [''],
        description: [''],
        cat_id: [0, Validators.required],
        price: [0],
        type: [0],
        path: [''],
        status: [0],
    });
    public data: IThemeComponent;
    private categories: ICategory[] = [];
    public typeItems = ComponentTypeItems;

    constructor(
        private fb: FormBuilder,
        private service: VisualService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) { }

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
                    this.data = res;
                    this.form.patchValue({
                        name: res.name,
                        thumb: res.thumb,
                        keywords: res.keywords,
                        description: res.description,
                        cat_id: res.cat_id,
                        price: res.price,
                        type: res.type,
                        status: res.status,
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

    public get typeValue() {
        return this.form.get('type').value;
    }

    public get filterCategories(): ICategory[] {
        const type = parseNumber(this.typeValue) + 1;
        return this.categories.filter(i => i.id === type || i.parent_id === type);
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
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IThemeComponent = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
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
