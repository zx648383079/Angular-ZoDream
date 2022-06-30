import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tvRoutedComponents, TvRoutingModule } from './tv-routing.module';

@NgModule({
    imports: [
        CommonModule,
        TvRoutingModule,
    ],
    declarations: [...tvRoutedComponents]
})
export class TvModule { }
