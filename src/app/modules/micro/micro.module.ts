import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { microRoutingComponents, MicroRoutingModule } from './micro-routing.module';
import { MicroService } from './micro.service';
import { ThemeModule } from '../../theme/theme.module';
import { MediaPlayerModule } from '../../components/media-player';
import { DialogModule } from '../../components/dialog';
import { LinkRuleModule } from '../../components/link-rule';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { Field } from '@angular/forms/signals';


@NgModule({
    declarations: [...microRoutingComponents],
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        TabletModule,
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
