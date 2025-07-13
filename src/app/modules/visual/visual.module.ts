import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualRoutingModule, visualRoutingComponents } from './visual-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        VisualRoutingModule,
    ],
    declarations: [
        ...visualRoutingComponents
    ],
})
export class VisualModule { }
