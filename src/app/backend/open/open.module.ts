import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../theme/theme.module';
import { openRoutedComponents, OpenRoutingModule } from './open-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusPipe } from './status.pipe';
import { PlatformOptionComponent } from './platform-option/platform-option.component';

@NgModule({
  imports: [
    CommonModule,
    NgbPaginationModule,
    ThemeModule,
    ReactiveFormsModule,
    OpenRoutingModule,
  ],
  declarations: [...openRoutedComponents, StatusPipe, PlatformOptionComponent],
  exports: [PlatformOptionComponent]
})
export class OpenModule { }
