import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { diskBackendRoutingComponents, DiskBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DiskService } from './disk.service';
import { FileExplorerModule } from '../../../components/file-explorer';
import { FILE_PROVIDER } from '../../../components/file-explorer/model';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        FileExplorerModule,
        DiskBackendRoutingModule,
        ZreFormModule,
    ],
    declarations: [
        ...diskBackendRoutingComponents,
    ],
    providers: [
        DiskService,
        {
            provide: FILE_PROVIDER,
            useClass: DiskService
        }
    ]
})
export class DiskBackendModule { }
