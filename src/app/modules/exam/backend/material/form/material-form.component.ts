import { Component, input, model } from '@angular/core';
import { ICourse, IQuestionMaterial } from '../../../model';

@Component({
    standalone: false,
    selector: 'app-material-form',
    templateUrl: './material-form.component.html',
    styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent {

    public readonly courseItems = input<ICourse[]>([]);
    public readonly value = model<IQuestionMaterial>({} as any);

    public typeItems = ['文本', '音频', '视频'];


    public onTitleChange(val: any) {
        this.value.update(v => {
            v.title = val;
            return v;
        });
    }

    public onCourseChange(e: Event) {
        this.value.update(v => {
            v.course_id = (e.target as HTMLSelectElement).value as any;
            return v;
        });
    }

    public onDescriptionChange(val: any) {
        this.value.update(v => {
            v.description = val;
            return {...v};
        });
    }

    public onTypeChange(e: Event) {
        this.value.update(v => {
            v.type = (e.target as HTMLSelectElement).value as any;
            return v;
        });
    }
    public onContentChange(val: any) {
        this.value.update(v => {
            v.content = val;
            return v;
        });
    }
}
