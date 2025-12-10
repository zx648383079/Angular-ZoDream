import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../components/dialog';
import { ISignature, ITemplate } from '../../model';
import { MessageServiceService } from '../../ms.service';
import { ButtonEvent } from '../../../../components/form';

@Component({
    standalone: false,
    selector: 'app-ms-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditTemplateComponent implements OnInit {
    private service = inject(MessageServiceService);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private toastrService = inject(DialogService);


    public form = this.fb.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
        content: ['', Validators.required],
        target_no: [''],
        type: [0],
    });

    public data: ITemplate;
    public typeItems = [];
    public keyItems: string[] = [];

    constructor() {
        this.service.typeItems().subscribe(res => {
            this.typeItems = res;
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.template(params.id).subscribe(res => {
                this.data = res;
                if (typeof res.data === 'string') {
                    this.keyItems = JSON.parse(res.data);
                } else if (res.data instanceof Array) {
                    this.keyItems = res.data;
                }
                this.form.patchValue({
                    name: res.name,
                    title: res.title,
                    content: res.content,
                    target_no: res.target_no,
                    type: res.type,
                });
            });
        });
    }

    public tapBack() {
        history.back();
    }

    public onContentChange() {
        const val = this.form.get('content').value;
        this.keyItems = [];
        if (!val) {
            return;
        }
        let match: RegExpMatchArray;
        const pattern = /\{(\w+)\}/g;
        while (null !== (match = pattern.exec(val))) {
            if (this.keyItems.indexOf(match[1]) >= 0) {
                continue;
            }
            this.keyItems.push(match[1]);
        }
    }

    public tapRemoveKey(item: string) {
        this.keyItems = this.keyItems.filter(i => i !== item);
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: ITemplate = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
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
