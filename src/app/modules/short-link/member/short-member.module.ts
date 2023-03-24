import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortMemberRoutingComponents, ShortMemberRoutingModule } from './routing.module';
import { ShortLinkService } from './short-link.service';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        ShortMemberRoutingModule
    ],
    declarations: [...ShortMemberRoutingComponents],
    providers: [
        ShortLinkService
    ]
})
export class ShortMemberModule { }
