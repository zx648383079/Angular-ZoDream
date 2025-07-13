import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdRoutingModule, adRoutedComponents } from './routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { AdService } from './ad.service';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        DesktopModule,
        ReactiveFormsModule,
        ZreFormModule,
        AdRoutingModule,
    ],
    declarations: [...adRoutedComponents],
    providers: [
        AdService,
    ]
})
export class AdSenseModule { }
