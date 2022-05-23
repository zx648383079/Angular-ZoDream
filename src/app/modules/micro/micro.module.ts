import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { microRoutingComponents, MicroRoutingModule } from './micro-routing.module';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MicroService } from './micro.service';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../theme/theme.module';
import { MediaPlayerModule } from '../../components/media-player';
import { DialogModule } from '../../components/dialog';
import { LinkRuleModule } from '../../components/link-rule';
import { ZreFormModule } from '../../components/form';


@NgModule({
    declarations: [...microRoutingComponents],
    imports: [
        CommonModule,
        FormsModule,
        ThemeModule,
        NgbDropdownModule,
        NgbPaginationModule,
        MediaPlayerModule,
        MicroRoutingModule,
        DialogModule,
        LinkRuleModule,
        ZreFormModule,
    ],
    providers: [
        MicroService
    ]
})
export class MicroModule { }
