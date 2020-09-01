import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShopRoutingModule, shopRoutedComponents } from './shop-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ShopService } from './shop.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';


@NgModule({
  declarations: [...shopRoutedComponents],
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThemeModule,
    ShopRoutingModule,
    EditorModule,
  ],
  providers: [
    ShopService,
  ],
})
export class ShopModule { }
