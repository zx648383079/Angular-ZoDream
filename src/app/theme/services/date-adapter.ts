import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateAdapter extends NgbDateAdapter<string> {

    readonly DELIMITER = '-';

    public fromModel(value?: string): NgbDateStruct | null {
        if (value) {
            const date = value.split(this.DELIMITER);
            return {
                year : parseInt(date[0], 10),
                month : parseInt(date[1], 10),
                day : parseInt(date[2].split(' ')[0], 10)
            };
        }
        return null;
    }

    public toModel(date: NgbDateStruct | null): string | null {
        return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
    }
}
