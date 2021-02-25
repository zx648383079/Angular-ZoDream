import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAttributeGroup } from '../../../../../theme/models/shop';
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
        private toastrService: ToastrService,
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

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IAttributeGroup = Object.assign({}, this.form.value);
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.groupSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
