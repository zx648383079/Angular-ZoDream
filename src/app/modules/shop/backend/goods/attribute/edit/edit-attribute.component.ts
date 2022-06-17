import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../../components/dialog';
import { parseNumber } from '../../../../../../theme/utils';
import { IAttribute, IAttributeGroup } from '../../../../model';
import { AttributeService } from '../../attribute.service';

@Component({
  selector: 'app-edit-attribute',
  templateUrl: './edit-attribute.component.html',
  styleUrls: ['./edit-attribute.component.scss']
})
export class EditAttributeComponent implements OnInit {

    public form = this.fb.group({
        name: ['', Validators.required],
        group_id: [0],
        search_type: ['0'],
        input_type: ['0'],
        default_value: [''],
        position: [99],
        type: ['0'],
    });

    public data: IAttribute;
    public groupItems: IAttributeGroup[] = [];

    constructor(
        private service: AttributeService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private toastrService: DialogService,
    ) {
        this.service.groupAll().subscribe(res => {
            this.groupItems = res.data;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                this.form.get('group_id').setValue(params.group);
                return;
            }
            this.service.attr(params.id).subscribe(res => {
                this.data = res;
                this.form.patchValue({
                    name: res.name,
                    search_type: res.search_type.toString(),
                    group_id: res.group_id,
                    input_type: res.input_type.toString(),
                    default_value: res.default_value as string,
                    position: res.position,
                    type: res.type.toString(),
                });
            });
        });
    }

    get isInput() {
        return parseNumber(this.form.get('input_type').value) > 0;
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit() {
        if (this.form.invalid) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        const data: IAttribute = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        this.service.groupSave(data).subscribe(_ => {
            this.toastrService.success('保存成功');
            this.tapBack();
        });
    }

}
