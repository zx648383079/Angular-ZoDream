import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiskRoutingModule, diskRoutingComponents } from './disk-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { DiskService } from './disk.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from '../dialog';
import { ProgressModule } from '../progress';
import { MediaPlayerModule } from '../media-player';


@NgModule({
    declarations: [
        ...diskRoutingComponents
    ],
    imports: [
        CommonModule,
        ThemeModule,
        NgbModule,
        DiskRoutingModule,
        DialogModule,
        ProgressModule,
        MediaPlayerModule,
    ],
    providers: [
        DiskService
    ]
})
export class DiskModule { }
