import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IItem } from '../../../../theme/models/seo';
import { IShipping } from '../../../../theme/models/shop';
import { ShopService } from '../../shop.service';

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

  public tapSubmit() {
    console.log(this.form.value);
  }

}
