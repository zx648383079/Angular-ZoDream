import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from './theme/theme.module';
import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './theme/theme.reducers';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ThemeModule.forRoot(),
    StoreModule.forRoot(reducers, { metaReducers }),
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressAnimation: 'increasing'
    }),
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
