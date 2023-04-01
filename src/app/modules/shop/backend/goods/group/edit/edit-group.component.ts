import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { ButtonEvent } from '../../../../../../components/form';
import { IAttributeGroup } from '../../../../model';
import { AttributeService } from '../../attribute.service';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        attr_group: [''],
    });

    public data: IAttributeGroup;

    constructor(
        private service: AttributeService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.group(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    attr_group: '',
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IAttributeGroup = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        e?.enter();
        this.service.groupSave(data).subscribe({
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
