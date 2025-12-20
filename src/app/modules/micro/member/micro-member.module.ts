import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroMemberRoutingComponents, MicroMemberRoutingModule } from './routing.module';
import { MicroService } from './micro.service';
import { ThemeModule } from '../../../theme/theme.module';
import { LinkRuleModule } from '../../../components/link-rule';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        LinkRuleModule,
        MicroMemberRoutingModule
    ],
    declarations: [...MicroMemberRoutingComponents],
    providers: [
        MicroService
    ]
})
export class MicroMemberModule { }
