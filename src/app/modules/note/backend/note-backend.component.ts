import { Component, inject, signal } from '@angular/core';
import { NoteService } from './note.service';

@Component({
    standalone: false,
    selector: 'app-note-backend',
    templateUrl: './note-backend.component.html',
    styleUrls: ['./note-backend.component.scss']
})
export class NoteBackendComponent {
    private readonly service = inject(NoteService);


    public readonly isLoading = signal(true);
    public readonly data = signal<any>({});

    constructor() {
        this.service.statistics().subscribe(res => {
            this.isLoading.set(false);
            this.data.set(res);
        });
    }

}
