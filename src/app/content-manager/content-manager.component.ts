import { Component, OnInit } from '@angular/core';
import { ContentService } from '@shared/services/content.service';
import { Upload } from '@shared/interfaces/upload';
import { Observable } from 'rxjs';
import { UploadComponent } from './upload/upload.component';
import { Content } from '@shared/interfaces/content';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { DataService } from '@shared/services/data.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.css']
})
export class ContentManagerComponent implements OnInit {
  currentUpload: Upload
  selectedFiles: FileList;

  selected: Upload
  fileList: Observable<Upload[]>
  constructor(
    public contentService: ContentService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.fileList = this.route.parent.params.switchMap(bar => {
      return this.contentService.getFileList(bar['client'])
    })
  }
  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  // uploadSingle() {
  //   let file = this.selectedFiles.item(0)
  //   this.currentUpload = new Upload(file)
  //   console.log(this.currentUpload.dateAdded)
  //   this.contentService.pushUpload(this.currentUpload)
  // }

  clearSelect() {
    this.selected ? this.selected = null : null
  }

  onClick(item: Upload) {
    this.isSelected(item) ? this.selected = null : this.selected = item
  }

  isSelected(item: Upload) {
    if (this.selected != null)
      return this.selected == item
    return false
  }

  remove() {
    if (confirm("Are you sure you want to delete this Image?") == true) {
      this.contentService.deleteUpload(this.selected)
    }
  }

  add() {
    const dialogRef = this.dialog.open(UploadFormComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          console.log(result)
          this.snackBar.open(`${result.file.name} has been uploaded`, "OK", {
            duration: 3000,
          })
        }
      })
  }
}
