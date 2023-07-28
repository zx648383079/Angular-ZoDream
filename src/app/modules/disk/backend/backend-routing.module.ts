import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { ClientComponent } from './client/client.component';
import { DiskBackendComponent } from './disk-backend.component';
import { FilesComponent } from './files/files.component';
import { ServersComponent } from './servers/servers.component';
import { ExplorerComponent } from './explorer/explorer.component';

const routes: Routes = [
    {
        path: 'files',
        component: FilesComponent,
    },
    {
        path: 'servers',
        component: ServersComponent,
    },
    {
        path: 'client',
        component: ClientComponent,
    },
    {
        path: 'explorer',
        component: ExplorerComponent,
    },
    {
        path: '',
        component: DiskBackendComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DiskBackendRoutingModule {}


export const diskBackendRoutingComponents = [
    DiskBackendComponent, FilesComponent, ServersComponent, ClientComponent, ExplorerComponent
];
