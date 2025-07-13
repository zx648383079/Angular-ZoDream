import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ZreFormModule } from '../../../../../components/form';
import { affiliateRoutedComponents, AffiliateRoutingModule } from './affiliate-routing.routing';
import { AffiliateService } from './affiliate.service';
import { DesktopModule } from '../../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        ZreFormModule,
        AffiliateRoutingModule
    ],
    declarations: [...affiliateRoutedComponents],
    providers: [
        AffiliateService,
    ],
})
export class AffiliateModule { }
