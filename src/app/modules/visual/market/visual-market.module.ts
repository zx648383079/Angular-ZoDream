import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualMarketRoutingModule, visualMarketRoutingComponents } from './market-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { VisualService } from './visual.service';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        VisualMarketRoutingModule,
        ZreFormModule,
    ],
    declarations: [...visualMarketRoutingComponents],
    providers: [
        VisualService,
    ]
})
export class VisualMarketModule { }

