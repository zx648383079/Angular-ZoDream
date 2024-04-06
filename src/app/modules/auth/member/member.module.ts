import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberRoutingModule, memberRoutedComponents } from './routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { LinkRuleModule } from '../../../components/link-rule';
import { ThemeModule } from '../../../theme/theme.module';
import { MemberService } from './member.service';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        LinkRuleModule,
        ReactiveFormsModule,
        DialogModule,
        FormsModule,
        MemberRoutingModule
    ],
    declarations: [...memberRoutedComponents],
    providers: [
        MemberService,
    ]
})
export class MemberModule { }
