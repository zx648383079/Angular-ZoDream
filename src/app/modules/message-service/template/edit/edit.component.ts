import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ISignature, ITemplate } from '../../model';
import { MessageServiceService } from '../../ms.service';
import { ButtonEvent } from '../../../../components/form';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-ms-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditTemplateComponent {
    private readonly service = inject(MessageServiceService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastrService = inject(DialogService);
    private readonly location = inject(Location);

    public readonly dataModel = signal({
        id: 0,
        name: '',
        title: '',
        content: '',
        target_no: '',
        type: '',
    });
    public readonly dataForm = form(this.dataModel, schemaPath => {
        required(schemaPath.name);
        required(schemaPath.title);
        required(schemaPath.content);
    });

    public data: ITemplate;
    public readonly typeItems = signal([]);
    public readonly keyItems = signal<string[]>([]);

    constructor() {
        this.service.typeItems().subscribe(res => {
            this.typeItems.set(res);
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.template(params.id).subscribe(res => {
                this.data = res;
                if (typeof res.data === 'string') {
                    this.keyItems.set(JSON.parse(res.data));
                } else if (res.data instanceof Array) {
                    this.keyItems.set(res.data);
                }
                this.dataModel.set({
                    id: res.id,
                    name: res.name,
                    title: res.title,
                    content: res.content,
                    target_no: res.target_no,
                    type: res.type as any,
                });
            });
        });
    }

    public tapBack() {
        this.location.back();
    }

    public onContentChange() {
        const val = this.dataForm.content().value();
        const items = [];
        if (!val) {
            this.keyItems.set(items);
            return;
        }
        let match: RegExpMatchArray;
        const pattern = /\{(\w+)\}/g;
        while (null !== (match = pattern.exec(val))) {
            if (items.indexOf(match[1]) >= 0) {
                continue;
            }
            items.push(match[1]);
        }
        this.keyItems.set(items);
    }

    public tapRemoveKey(item: string) {
        this.keyItems.update(v => {
            return v.filter(i => i !== item);
        });
    }

    public tapSubmit2(e: SubmitEvent) {
        e.preventDefault();
        this.tapSubmit();
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ITemplate = this.dataForm().value() as any;

        data.data = this.keyItems;
        e?.enter();
        this.service.templateSave(data).subscribe({
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
