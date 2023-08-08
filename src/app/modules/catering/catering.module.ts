import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cateringRoutingComponents, CateringRoutingModule } from './catering-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { ContextMenuModule } from '../../components/context-menu';
import { ZreFormModule } from '../../components/form';
import { AuthSharedModule } from '../auth/auth-shared.module';
import { CateringService } from './catering.service';
import { ZreScannerModule } from '../../components/scanner';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        CateringRoutingModule,
        AuthModule,
        ContextMenuModule,
        ZreFormModule,
        ZreScannerModule,
        AuthSharedModule,
    ],
    declarations: [...cateringRoutingComponents],
    providers: [
        CateringService,
    ]
})
export class CateringModule { }
