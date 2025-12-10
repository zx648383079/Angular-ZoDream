import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IErrorResponse } from '../../../theme/models/page';
import { AuthService, ThemeService } from '../../../theme/services';
import { DialogService } from '../../../components/dialog';
import { confirmValidator } from '../../../components/desktop/directives';

@Component({
    standalone: false,
    selector: 'app-auth-find',
    templateUrl: './find.component.html',
    styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {
    private fb = inject(FormBuilder);
    private service = inject(AuthService);
    private toastrService = inject(DialogService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private themeService = inject(ThemeService);


    public sended = false;
    public isObserve = false;

    public findForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        code: [''],
        password: [''],
        confirm_password: ['']
    }, {
        validators: confirmValidator()
    });

    constructor() {
        this.themeService.titleChanged.next($localize `Retrieve password`);
    }

    ngOnInit() {}

    get btnLabel() {
        return this.sended ? $localize `Reset Password ` : $localize `Send verification email`;
    }

    public tapSubmit() {
        if (!this.sended) {
            this.service.sendFindEmail(this.findForm.get('email').value).subscribe({
                next: res => {
                    this.toastrService.success(res.message);
                    this.sended = true;
                }, error: err => {
                    const res = err.error as IErrorResponse;
                    this.toastrService.warning(res.message);
                }
            });
            return;
        }
        const data = Object.assign({}, this.findForm.value);
        if (!data.code) {
            this.toastrService.warning($localize `Please input the security code`);
            return;
        }
        if (!data.password) {
            this.toastrService.warning($localize `Please input a new password `);
            return;
        }
        this.service.resetPassword(data).subscribe({
            next: _ => {
                this.toastrService.success($localize `Successfully retrieve the password`);
                this.router.navigate(['../'], {relativeTo: this.route});
            }, error: err => {
                const res = err.error as IErrorResponse;
                this.toastrService.warning(res.message);
            }
        });
    }
}
