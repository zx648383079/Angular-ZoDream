import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { ITag } from '../../../model';
import { BlogService } from '../../blog.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-tag',
    templateUrl: './edit-tag.component.html',
    styleUrls: ['./edit-tag.component.scss']
})
export class EditTagComponent implements OnInit {
    private readonly service = inject(BlogService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);


    public readonly dataModel = signal({
        id: 0,
        name: '',
        description: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
    });

    public data: ITag;

    ngOnInit() {
        this.route.params.subscribe(params => {
        if (!params.id) {
            return;
        }
        this.service.tag(params.id).subscribe(res => {
            this.data = res;
            this.dataModel.set({
                        id: res.id,
                name: res.name,
                description: res.description
            });
        });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ITag = this.dataForm().value() as any;

        this.service.tagSave(data).subscribe(_ => {
            this.toastrService.success($localize `Save Successfully`);
            this.tapBack();
        });
    }

}
