import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../components/dialog';
import { ButtonEvent } from '../../components/form';
import { ThemeService } from '../../theme/services';
import { emptyValidate } from '../../theme/validators';
import { FrontendService } from '../frontend.service';

@Component({
    standalone: false,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

    public data = {
        name: '',
        email: '',
        phone: '',
        content: '',
    };
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

    constructor(
        private service: FrontendService,
        private toastrService: DialogService,
        private themeService: ThemeService,
    ) { }

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
        if (emptyValidate(this.data.name)) {
            this.toastrService.warning('请输入称呼');
            return;
        }
        if (emptyValidate(this.data.content)) {
            this.toastrService.warning('请输入内容');
            return;
        }
        e?.enter();
        this.service.feedback(this.data).subscribe({
            next: _ => {
                this.toastrService.success('提交成功');
                this.data.content = '';
                e?.reset();
            },
            error: err => {
                this.toastrService.error(err);
                e?.reset();
            }
        });
    }

}
