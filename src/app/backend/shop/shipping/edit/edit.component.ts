import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../../../../theme/models/seo';
import { IShipping } from '../../../../theme/models/shop';
import { PaymentService } from '../../payment.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditShippingComponent implements OnInit {

  public data: IShipping;

  public items: IItem[] = [];

  public form = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    method: [0],
    icon: [''],
    description: [''],
    position: [99],
  });

  constructor(
    private service: PaymentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastrService: ToastrService,
  ) {
    this.service.shippingPlugin().subscribe(res => {
      this.items = res;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.shipping(params.id).subscribe(res => {
        this.data = res;
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
    const data: any = this.form.value;
    if (this.data && this.data.id > 0) {
      data.id = this.data.id;
    }
    this.service.paymentSave(data).subscribe(_ => {
      this.toastrService.success('保存成功');
      this.tapBack();
    });
  }

  public uploadFile(event: any) {

  }

}
