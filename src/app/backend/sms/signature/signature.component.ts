import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ISignature } from '../../../theme/models/sms';
import { SmsService } from '../sms.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent {

  public items: ISignature[] = [];

  public hasMore = true;

  public page = 1;

  public perPage = 20;

  public isLoading = false;

  public total = 0;

  public keywords = '';

  public editData: ISignature;

  constructor(
    private service: SmsService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    this.tapRefresh();
  }

  public get pageTotal(): number {
    return Math.ceil(this.total / this.perPage);
  }

  /**
   * tapRefresh
   */
  public tapRefresh() {
    this.goPage(1);
  }

  public tapPage() {
    this.goPage(this.page);
  }

  public tapMore() {
    this.goPage(this.page + 1);
  }

  /**
   * goPage
   */
  public goPage(page: number) {
    if (this.isLoading) {
        return;
    }
    this.isLoading = true;
    this.service.signatureList({
      keywords: this.keywords,
      page,
      per_page: this.perPage
    }).subscribe(res => {
        this.isLoading = false;
        this.items = res.data;
        this.hasMore = res.paging.more;
        this.total = res.paging.total;
    });
  }

  public tapSearch(form: any) {
    this.keywords = form.keywords;
    this.tapRefresh();
  }

  public tapRemove(item: ISignature) {
    if (!confirm('确定删除“' + item.name + '”签名？')) {
      return;
    }
    this.service.signatureRemove(item.id).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.toastrService.success('删除成功');
      this.items = this.items.filter(it => {
        return it.id !== item.id;
      });
    });
  }

  public tapDefault(item: ISignature) {
    this.service.signatureDefault(item.id).subscribe(_ => {
      this.items = this.items.map(it => {
        it.is_default = item.id === item.id ? 1 : 0;
        return it;
      });
    });
  }

  open(content: any, item?: ISignature) {
    this.editData = item || {id: undefined, name: '', sign_no: ''};
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(_ => {
      this.service.signatureSave({
        name: this.editData.name,
        sign_no: this.editData.sign_no,
        id: this.editData?.id
      }).subscribe(res => {
        this.toastrService.success('保存成功');
        this.tapPage();
      });
    });
  }

}
