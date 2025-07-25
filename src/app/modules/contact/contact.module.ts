import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule, contactRoutedComponents } from './contact-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ContactService } from './contact.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';


@NgModule({
    declarations: [...contactRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ContactRoutingModule,
        ZreFormModule,
        DialogModule,
    ],
    providers: [
        ContactService,
    ],
})
export class ContactModule { }
