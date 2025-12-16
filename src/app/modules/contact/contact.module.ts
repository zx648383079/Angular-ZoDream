import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule, contactRoutedComponents } from './contact-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ContactService } from './contact.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { ZreSwiperModule } from '../../components/swiper';
import { Field } from '@angular/forms/signals';


@NgModule({
    declarations: [...contactRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        ContactRoutingModule,
        ZreFormModule,
        ZreSwiperModule,
        DialogModule,
    ],
    providers: [
        ContactService,
    ],
})
export class ContactModule { }
