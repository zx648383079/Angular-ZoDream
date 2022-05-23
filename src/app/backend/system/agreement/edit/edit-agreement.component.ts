import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IAgreement } from '../../../../theme/models/seo';
import { emptyValidate } from '../../../../theme/validators';
import { SystemService } from '../../system.service';

@Component({
  selector: 'app-edit-agreement',
  templateUrl: './edit-agreement.component.html',
  styleUrls: ['./edit-agreement.component.scss']
})
export class EditAgreementComponent implements OnInit {

    public data: IAgreement = {
        id: 0,
        name: '',
        title: '',
        description: '',
        content: [],
        status: 0,
    } as any;

    constructor(
        private service: SystemService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
      ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.agreement(params.id).subscribe(res => {
                    this.data = res;
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (emptyValidate(this.data.name) || emptyValidate(this.data.title) || this.data.content.length < 1) {
            this.toastrService.warning('表单填写不完整');
            return;
        }
        e?.enter();
        this.service.agreementSave(this.data).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success('保存成功');
                this.tapBack();
            },
            error: err => {
                e?.reset();
                this.toastrService.error(err);
            }
        });
    }

}
