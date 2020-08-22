import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IItem } from '../../../../theme/models/seo';
import { IPayment } from '../../../../theme/models/shop';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPaymentComponent implements OnInit {

  public data: IPayment;

  public items: IItem[] = [];

  public form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    sex: [0],
    avatar: [''],
    birthday: [''],
  });

  constructor(
    private service: ShopService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.service.paymentPlugin().subscribe(res => {
      this.items = res;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.service.payment(params.id).subscribe(res => {
        this.data = res;
      });
    });
  }

  public tapSubmit() {
    console.log(this.form.value);
  }

}
