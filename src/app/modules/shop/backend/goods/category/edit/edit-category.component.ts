import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { ICategory } from '../../../../model';
import { filterTree } from '../../../../../../theme/utils';
import { GoodsService } from '../../goods.service';
import { form, required } from '@angular/forms/signals';
import { ButtonEvent } from '../../../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent {
    private readonly service = inject(GoodsService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        parent_id: '0',
        keywords: '',
        description: '',
        icon: '',
        banner: '',
        app_banner: '',
        position: 99,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: ICategory;
    public categories: ICategory[] = [];

    constructor() {
        this.service.categoryAll().subscribe(res => {
            this.categories = res.data;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.category(params.id).subscribe(res => {
                this.data = res;
                this.categories = filterTree(this.categories, res.id);
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    parent_id: res.parent_id as any,
                    keywords: res.keywords,
                    description: res.description,
                    icon: res.icon,
                    banner: res.banner,
                    app_banner: res.app_banner,
                    position: res.position,
                });
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ICategory = this.dataForm().value() as any;
        e.enter();
        this.service.categorySave(data).subscribe({
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
