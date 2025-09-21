import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { microBackendRoutedComponents, MicroBackendRoutingModule } from './micro-routing.module';
import { MicroService } from './micro.service';
import { DesktopModule } from '../../../components/desktop';
import { ZreSwiperModule } from '../../../components/swiper';
import { LinkRuleModule } from '../../../components/link-rule';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        LinkRuleModule,
        ZreSwiperModule,
        MicroBackendRoutingModule,
    ],
    declarations: [...microBackendRoutedComponents],
    providers: [
        MicroService,
    ]
})
export class MicroModule { }
