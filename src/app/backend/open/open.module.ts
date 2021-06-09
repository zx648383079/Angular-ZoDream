import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../theme/theme.module';
import { openRoutedComponents, OpenRoutingModule } from './open-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusPipe } from './status.pipe';
import { PlatformOptionComponent } from './platform-option/platform-option.component';
import { OpenService } from './open.service';
import { ZreFormModule } from '../../form';

@NgModule({
    imports: [
        CommonModule,
        NgbPaginationModule,
        ThemeModule,
        ReactiveFormsModule,
        OpenRoutingModule,
        ZreFormModule,
    ],
    declarations: [...openRoutedComponents, StatusPipe, PlatformOptionComponent],
    exports: [PlatformOptionComponent],
    providers: [
        OpenService,
    ]
})
export class OpenModule { }
