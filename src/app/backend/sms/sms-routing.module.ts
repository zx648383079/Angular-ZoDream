import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogComponent } from './log/log.component';
import { OptionComponent } from './option/option.component';
import { SignatureComponent } from './signature/signature.component';
import { SmsComponent } from './sms.component';
import { EditTemplateComponent } from './template/edit/edit.component';
import { TemplateComponent } from './template/template.component';


const routes: Routes = [
    {
        path: 'log',
        component: LogComponent,
    },
    {
        path: 'option',
        component: OptionComponent,
    },
    {
        path: 'signature',
        component: SignatureComponent,
    },
    {
        path: 'template/create',
        component: EditTemplateComponent,
    },
    {
        path: 'template/edit/:id',
        component: EditTemplateComponent,
    },
    {
        path: 'template',
        component: TemplateComponent,
    },
    {
        path: '',
        component: SmsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SmsRoutingModule { }

export const smsRoutedComponents = [
    SmsComponent,
    LogComponent,
    TemplateComponent,
    EditTemplateComponent,
    OptionComponent,
    SignatureComponent,
];
