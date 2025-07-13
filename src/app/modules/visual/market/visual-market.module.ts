import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualMarketRoutingModule, visualMarketRoutingComponents } from './market-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { VisualService } from './visual.service';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        VisualMarketRoutingModule,
        ZreFormModule,
    ],
    declarations: [...visualMarketRoutingComponents],
    providers: [
        VisualService,
    ]
})
export class VisualMarketModule { }

