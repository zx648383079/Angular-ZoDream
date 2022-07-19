import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shortRoutingComponents, ShortRoutingModule } from './routing.module';
import { ShortLinkService } from './short-link.service';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        ShortRoutingModule,
    ],
    declarations: [...shortRoutingComponents],
    providers: [
        ShortLinkService
    ]
})
export class ShortLinkModule { }
