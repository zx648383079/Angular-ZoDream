import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ISignature, ITemplate } from '../../../../theme/models/sms';
import { SmsService } from '../../sms.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditTemplateComponent implements OnInit {

  public form = this.fb.group({
    name: ['', Validators.required],
    signature_id: [0],
    content: ['', Validators.required],
    sign_no: [''],
    type: [0],
  });

  public data: ITemplate;
  public typeItems = [];
  public signatureItems: ISignature[] = [];

  constructor(
    private service: SmsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: DialogService,
  ) {
    this.service.typeItems().subscribe(res => {
      this.typeItems = res;
    })
    this.service.signatureAll().subscribe(res => {
      this.signatureItems = res.data;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.template(params.id).subscribe(res => {
        this.data = res;
        this.form.patchValue({
          name: res.name,
          signature_id: res.signature_id,
          content: res.content,
          sign_no: res.sign_no,
          type: res.type,
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
    const data: ITemplate = Object.assign({}, this.form.value);
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.templateSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

}
