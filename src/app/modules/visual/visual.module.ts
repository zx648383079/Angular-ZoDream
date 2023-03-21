import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualRoutingModule, visualRoutingComponents } from './visual-routing.module';
import { ThemeModule } from '../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        VisualRoutingModule,
    ],
    declarations: [
        ...visualRoutingComponents
    ],
})
export class VisualModule { }
