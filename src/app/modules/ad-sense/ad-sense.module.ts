import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdRoutingModule, adRoutedComponents } from './routing.module';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { AdService } from './ad.service';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        DesktopModule,
        ZreFormModule,
        AdRoutingModule,
        FormField,
    ],
    declarations: [...adRoutedComponents],
    providers: [
        AdService,
    ]
})
export class AdSenseModule { }
