import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ButtonEvent } from '../../../../components/form';
import { IItem } from '../../../../theme/models/seo';
import { SystemService } from '../../system.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-edit-agreement',
    templateUrl: './edit-agreement.component.html',
    styleUrls: ['./edit-agreement.component.scss']
})
export class EditAgreementComponent {
    private readonly service = inject(SystemService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        title: '',
        language: '',
        description: '',
        content: [],
        status: 0,
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.title);
        required(schemaPath.content);
    });

    public languageItems: IItem[] = [];

    constructor() {
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
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    language: res.language,
                    title: res.title,
                    description: res.description,
                    content: res.content,
                    status: res.status,
                });
            });
            return;
        }
        this.toastrService.confirm({
            content: '是否复制当前内容完成翻译？',
            onConfirm: () => {
                this.dataModel.update(v => {
                    v.id = 0;
                    v.language = lang;
                    return {...v};
                })
            },
            onCancel: () => {
                this.dataModel.update(v => {
                    v.id = 0;
                    v.language = lang;
                    v.title = '';
                    v.description = '';
                    v.content = [];
                    return {...v};
                });
            }
        });
    }

    public tapBack() {
        this.location.back();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        e?.enter();
        this.service.agreementSave(this.dataForm().value()).subscribe({
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
