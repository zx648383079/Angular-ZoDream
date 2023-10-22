import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogComponent } from './log/log.component';
import { OptionComponent } from './option/option.component';
import { SignatureComponent } from './signature/signature.component';
import { MessageServiceComponent } from './ms.component';
import { EditTemplateComponent } from './template/edit/edit.component';
import { TemplateComponent } from './template/template.component';


const routes: Routes = [
    {
        path: 'log',
        component: LogComponent,
    },
    {
        path: 'option/:type',
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
        component: MessageServiceComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessageServiceRoutingModule { }

export const MessageServiceRoutedComponents = [
    MessageServiceComponent,
    LogComponent,
    TemplateComponent,
    EditTemplateComponent,
    OptionComponent,
    SignatureComponent,
];
