import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IAgreement, IItem } from '../../../../theme/models/seo';
import { emptyValidate } from '../../../../theme/validators';
import { SystemService } from '../../system.service';

@Component({
    standalone: false,
  selector: 'app-edit-agreement',
  templateUrl: './edit-agreement.component.html',
  styleUrls: ['./edit-agreement.component.scss']
})
export class EditAgreementComponent implements OnInit {
    private service = inject(SystemService);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public data: IAgreement = {
        id: 0,
        name: '',
        title: '',
        description: '',
        content: [],
        status: 0,
    } as any;

    public languageItems: IItem[] = [];

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.loadDetail(params.id);
        });
    }

    public loadDetail(id: any, lang?: string) {
        if (id && id  > 0) {
            this.service.agreement(id).subscribe(res => {
                this.languageItems = res.languages;
                delete res.languages;
                this.data = res;
            });
            return;
        }
        this.toastrService.confirm({
            content: '是否复制当前内容完成翻译？',
            onConfirm: () => {
                this.data = {...this.data, id: 0, language: lang};
            },
            onCancel: () => {
                this.data = {
                    id: 0,
                    name: this.data.name,
                    language: lang,
                    title: '',
                    description: '',
                    content: [],
                    status: this.data.status,
                } as any;
            }
        });
    }

    public tapBack() {
        history.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (emptyValidate(this.data.name) || emptyValidate(this.data.title) || this.data.content.length < 1) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        e?.enter();
        this.service.agreementSave(this.data).subscribe({
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
