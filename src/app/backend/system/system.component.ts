import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IOption } from '../../theme/models/seo';
import { FileUploadService } from '../../theme/services/file-upload.service';
import { SystemService } from './system.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  public groups: IOption[] = [];

  public editData: IOption;

  constructor(
    private service: SystemService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private uploadService: FileUploadService,
  ) {
    this.service.optionList().subscribe(res => {
        this.groups = res.data.map(group => {
          if (!group.children) {
            group.children = [];
          }
          group.children = group.children.map(item => {
            if (['select', 'radio', 'checkbox'].indexOf(item.type)) {
              item.items = this.strToArr(item.default_value);
            }
            if (item.type === 'checkbox') {
              item.values = item.value.split(',');
            }
            return item;
          });
          return group;
        });
    });
  }

  ngOnInit(): void {
  }

  private strToArr(val: any): string[] {
    if (typeof val === 'object') {
        return val;
    }
    const items: string[] = [];
    val.toString().split('\n').forEach((item: string) => {
        item = item.replace('\r', '').trim();
        if (!item || item.length < 1) {
            return;
        }
        if (items.indexOf(item) >= 0) {
            return;
        }
        items.push(item);
    });
    return items;
}


  public uploadImage(event: any, item: IOption) {
    const files = event.target.files as FileList;
    this.uploadService.uploadImage(files[0]).subscribe(res => {
      item.value = res.url;
    });
  }

  public uploadFile(event: any, item: IOption) {
    const files = event.target.files as FileList;
    this.uploadService.uploadFile(files[0]).subscribe(res => {
      item.value = res.url;
    });
  }

  public tapPreview(item: IOption) {
    window.open(item.value, '_blank');
  }

  public tapSubmit() {
    const option: any = {};
    for (const group of this.groups) {
      for (const item of group.children) {
        option[item.id] = item.value;
      }
    }
    this.service.optionSave({option}).subscribe(res => {
      this.toastrService.success('保存成功');
    }, err => {
      this.toastrService.warning(err.error.message);
    });
  }


  public tapAddGroup(content: any) {
    this.editData = {
      name: '',
      code: '',
      parent_id: 0,
      type: 'group',
      visibility: 1,
      default_value: '',
      value: '',
      position: 99,
    };
    this.tapOpenModal(content);
  }

  public tapEditOption(content: any, item: IOption) {
    this.editData = item;
    this.tapOpenModal(content);
  }

  public tapOpenModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(value => {
      if (value === 'remove') {
        if (!confirm('确定删除此项')) {
          return;
        }
        this.service.optionRemove(this.editData.id).subscribe(res => {
          this.toastrService.success('删除成功');
          this.removeOption(this.editData);
        });
        return;
      }
      this.service.optionSaveField(this.editData).subscribe(res => {
        this.toastrService.success('保存成功');
      }, err => {
        this.toastrService.warning(err.error.message);
      });
    });
  }

  private removeOption(item: IOption) {
    const groups = this.groups;
    all:
    for (let i = 0; i < groups.length; i++) {
      const group = this.groups[i];
      if (group.id === item.id) {
        groups.splice(i, 1);
        break;
      }
      for (let j = 0; j < group.children.length; j++) {
        if (group.children[j].id === item.id) {
          group.children.splice(j, 1);
          break all;
        }
      }
    }
    this.groups = groups;
  }
}
