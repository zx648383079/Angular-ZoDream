import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICategory, IMovie, IMovieArea, ITag } from '../../../model';
import { catchError, concat, distinctUntilChanged, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { TVService } from '../../tv.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../components/dialog';
import { FileUploadService } from '../../../../../theme/services';
import { ButtonEvent } from '../../../../../components/form';
import { EditorBlockType, IEditorFileBlock, IImageUploadEvent } from '../../../../../components/editor';

@Component({
    standalone: false,
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss']
})
export class EditMovieComponent implements OnInit {

    public form = this.fb.group({
        title: ['', Validators.required],
        cover: [''],
        content: ['', Validators.required],
        description: [''],
        cat_id: [0, Validators.required],
        film_title: [''],
        translation_title: [''],
        director: [''],
        leader:  [''],
        area_id: [0, Validators.required],
        age: [''],
        language:  [''],
        release_date: [''],
        duration: [''],
        series_count: [0],
        status: [0],
    });
    public data: IMovie;
    public tags: ITag[] = [];
    public categories: ICategory[] = [];
    public areaItems: IMovieArea[] = [];
    public tagItems$: Observable<ITag[]>;
    public tagInput$ = new Subject<string>();
    public tagLoading = false;

    constructor(
        private fb: FormBuilder,
        private service: TVService,
        private route: ActivatedRoute,
        private toastrService: DialogService,
        private uploadService: FileUploadService,
    ) { }

    ngOnInit() {
        this.service.batch({
            categories: {},
            areas: {}
        }).subscribe(res => {
            this.categories = res.categories;
            this.areaItems = res.areas;
        });
        this.route.params.subscribe(params => {
            if (!params.id) {
                return;
            }
            this.service.movie(params.id).subscribe({
                next: res => {
                    this.data = res;
                    if (res.tags) {
                        this.tags = res.tags;
                    }
                    this.form.patchValue({
                        title: res.title,
                        film_title: res.film_title,
                        translation_title: res.translation_title,
                        cover: res.cover,
                        director: res.director,
                        leader: res.leader,
                        cat_id: res.cat_id,
                        area_id: res.area_id,
                        age: res.age,
                        language: res.language,
                        release_date: res.release_date,
                        duration: res.duration,
                        description: res.description,
                        content: res.content,
                        series_count: res.series_count,
                        status: res.status,
                    });
                },
                error: err => {
                    this.toastrService.error(err);
                    history.back();
                }
            });
        });
        this.tagItems$ = concat(
            of([]), // default items
            this.tagInput$.pipe(
                distinctUntilChanged(),
                tap(() => this.tagLoading = true),
                switchMap(keywords => this.service.tagList({keywords}).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.tagLoading = false),
                    map(res => res instanceof Array ? res : res.data)
                ))
            )
        );
    }

    public get isOpenSource() {
        return this.form.get('is_open_source').value;
    }

    public addTagFn(name: string) {
        return {name};
    }

    public tapSubmit(e?: ButtonEvent) {
        if (this.form.invalid) {
            this.toastrService.warning($localize `Incomplete filling of the form`);
            return;
        }
        const data: IMovie = Object.assign({}, this.form.value) as any;
        if (this.data && this.data.id > 0) {
            data.id = this.data.id;
        }
        data.tags = this.tags;
        e?.enter();
        this.service.movieSave(data).subscribe({
            next: _ => {
                e.reset();
                this.toastrService.success($localize `Save Successfully`);
                history.back();
            },
            error: err => {
                this.toastrService.error(err);
                e?.reset();
            }
        });
    }

    public editorImageUpload(event: IImageUploadEvent) {
        this.uploadService.uploadImages(event.files).subscribe(res => {
            for (const item of res) {
                event.target.insert(<IEditorFileBlock>{
                    type: EditorBlockType.AddImage,
                    value: item.url,
                    title: item.original,
                    size: item.size
                });
            }
        });
    }

}
