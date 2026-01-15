import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../theme/theme.module';
import { ZreFormModule } from '../../../../../components/form';
import { affiliateRoutedComponents, AffiliateRoutingModule } from './affiliate-routing.routing';
import { AffiliateService } from './affiliate.service';
import { DesktopModule } from '../../../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        ZreFormModule,
        AffiliateRoutingModule
    ],
    declarations: [...affiliateRoutedComponents],
    providers: [
        AffiliateService,
    ],
})
export class AffiliateModule { }
