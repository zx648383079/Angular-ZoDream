import { Component, OnInit, inject, signal } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { ButtonEvent } from '../../components/form';
import { ThemeService } from '../../theme/services';
import { FrontendService } from '../frontend.service';
import { form, required } from '@angular/forms/signals';

@Component({
    standalone: false,
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    private readonly service = inject(FrontendService);
    private readonly toastrService = inject(DialogService);
    private readonly themeService = inject(ThemeService);


    public readonly dataForm = form(signal({
        name: '',
        email: '',
        phone: '',
        content: '',
    }), schemaPath => {
        required(schemaPath.name, {message: '请输入称呼'});
        required(schemaPath.content, {message: '请输入内容'});
    });
    public developer: {
        name: string;
        avatar: string;
        description: string;
        links: {
            title: string;
            icon: string;
            url: string;
        }[];
        skills: {
            name: string;
            proficiency: number;
            formatted_proficiency: string;
            duration: string;
            links: {
                title: string;
                url: string;
            }[];
        }[];
    } = {} as any;

    ngOnInit() {
        this.themeService.titleChanged.next($localize `Abount`);
        this.service.developer().subscribe(res => {
            this.developer = {...res, skills: res.skills.map(i => {
                return {...i, proficiency: 0}
            })};
            setTimeout(() => {
                for (let i = 0; i < res.skills.length; i++) {
                    this.developer.skills[i].proficiency = res.skills[i].proficiency;
                }
            }, 100);
        });
    }

    public tapSubmit(e: ButtonEvent) {
        if (this.dataForm().invalid()) {
            this.toastrService.warning('请输入内容');
            return;
        }
        e?.enter();
        this.service.feedback(this.dataForm().value()).subscribe({
            next: _ => {
                this.toastrService.success('提交成功');
                this.dataForm.content().value.set('');
                e?.reset();
            },
            error: err => {
                this.toastrService.error(err);
                e?.reset();
            }
        });
    }

}
