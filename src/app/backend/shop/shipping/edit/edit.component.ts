import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IItem } from '../../../../theme/models/seo';
import { IRegion, IShipping } from '../../../../theme/models/shop';
import { PaymentService } from '../../payment.service';
import { RegionService } from '../../region.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditShippingComponent implements OnInit {

  public data: IShipping;

  public items: IItem[] = [];

  public regionItems: IRegion[] = [];
  public selectedItems: IRegion[] = [];
  public selectedAll = false;
  public groupItems = [];
  public regionKeywords = '';

  public form = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    method: ['0'],
    icon: [''],
    description: [''],
    position: [99],
  });

  constructor(
    private service: PaymentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private regionService: RegionService,
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

  get method() {
    return this.form.get('method').value;
  }

  public tapBack() {
    history.back();
  }

  public tapSubmit() {
    if (this.form.invalid) {
      this.toastrService.warning('表单填写不完整');
      return;
    }
    const data: any = Object.assign({}, this.form.value);
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

  public open(content: any, item?: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(_ => {

    });
  }

  public removeGroup(item: any) {

  }

  public tapSelectAll() {
    this.selectedAll = !this.selectedAll;
  }

  public tapRegionSearch() {
    this.regionService.regionSearch({
      keywords: this.regionKeywords,
    }).subscribe(res => {
      this.regionItems = res.data;
    });
  }

  public tapAddRegion(item: IRegion) {
    if (this.selectedAll) {
      return;
    }
    for (const region of this.selectedItems) {
      if (region.id === item.id || item.full_name.indexOf(region.full_name) === 0) {
        return;
      }
    }
    this.selectedItems.push(item);
  }

  public removeRegion(item: IRegion) {
    this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
  }
}
