import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../components/dialog';
import { ButtonEvent } from '../../../components/form';
import { emptyValidate } from '../../../theme/validators';
import { MicroService } from '../micro.service';
import { disabled, form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-micro-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly service = inject(MicroService);
    private readonly toastrService = inject(DialogService);


    public readonly dataForm = form(signal({
        shareappid: '',
        title: '',
        summary: '',
        url: '',
        pics: <string[]>[],
        sharesource: '',
        content: '',
        open_type: '0',
    }), schemaPath => {
        required(schemaPath.content);
        disabled(schemaPath.url);
    });

    public readonly wordLength = computed(() => this.dataForm.content().value().length);

    public typeItems = [
        $localize `Public`, 
        $localize `Tucao`, 
        $localize `Private`
    ];

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.dataForm().value.set({
                shareappid: params.appid || '',
                title: params.title || '',
                summary: params.summary || '',
                url: params.url || '',
                pics: params.pics ? (params.pics instanceof Array ? params.pics : [params.pics]) : [],
                sharesource: params.sharesource || '',
                content: '',
                open_type: '0',
            });
            this.service.shareCheck(this.dataForm().value()).subscribe({
                error: err => {
                    this.toastrService.warning(err);
                    // this.router.navigate(['../'], {relativeTo: this.route});
                }
            });
        });
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning($localize `Please input content`);
            return;
        }
        e?.enter();
        this.service.shareSave(this.dataForm().value()).subscribe({
            next: _ => {
                e?.reset();
                this.toastrService.success($localize `Successful sharing`);
                this.router.navigate(['../'], {relativeTo: this.route});
            }, 
            error: err => {
                e?.reset();
                this.toastrService.warning(err);
            }
        });
    }

    public tapRemoveImage(i: number) {
        this.dataForm.pics().value.update(v => {
            v.splice(i, 1);
            return v;
        });
    }

}
