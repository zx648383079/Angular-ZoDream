import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ThemeModule } from '../../../theme/theme.module';
import { GameProfilerRoutingModule, gameProfilerRoutedComponents } from './routing.module';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        DialogModule,
        GameProfilerRoutingModule
    ],
    declarations: [... gameProfilerRoutedComponents]
})
export class GameProfilerModule { }
