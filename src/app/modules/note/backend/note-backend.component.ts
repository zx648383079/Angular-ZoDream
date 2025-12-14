import { Component, OnInit, inject } from '@angular/core';
import { NoteService } from './note.service';

@Component({
    standalone: false,
  selector: 'app-note-backend',
  templateUrl: './note-backend.component.html',
  styleUrls: ['./note-backend.component.scss']
})
export class NoteBackendComponent implements OnInit {
    private readonly service = inject(NoteService);


    public isLoading = true;
    public data: any = {};

    ngOnInit() {
        this.service.statistics().subscribe(res => {
            this.isLoading = false;
            this.data = res;
        });
    }

}
