import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogAddBeerDialog } from 'app/search/beer-form/form.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '@shared/services/content.service';
import { Upload } from '@shared/interfaces/upload';
import { fileURLToPath } from 'url';
import { delay } from 'rxjs-compat/operator/delay';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {
  uploadForm: FormGroup
  selectedFiles: File
  img: string | ArrayBuffer
  currentUpload: Upload;
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAddBeerDialog>,
    @Inject(MAT_DIALOG_DATA)
    public input: any,
    private fb: FormBuilder,
    private service: ContentService) { }

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm() {
    this.uploadForm = this.fb.group({
      displayName: ['', [Validators.required]],
      file: '',
      //fileUrl: '',
    })
  }

  getPreview() {
    if (this.img == null) {
      // if (this.uploadForm.get('fileUrl').value.length == 0)
      return null
      // return this.uploadForm.get('fileUrl').value
    }
    return this.img
  }

  detectFiles(event) {
    if (event.target.files[0]) {
      this.selectedFiles = event.target.files[0]
      var reader = new FileReader();
      reader.onload = e => this.img = reader.result;
      reader.readAsDataURL(this.selectedFiles);
    }
    else this.img = ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd() {
    if (this.selectedFiles) {
      this.currentUpload = new Upload(this.selectedFiles)
      this.service.pushUpload(this.currentUpload, this.uploadForm.get('displayName').value)
      setTimeout(() => {
        return this.dialogRef.close(this.currentUpload)
      }, 1000)
    } else {
      // this.service.pushUrl(this.uploadForm.get('fileUrl').value, this.uploadForm.get('displayName').value)
      // setTimeout(() => {
      //   return this.dialogRef.close(this.currentUpload)
      // }, 1000)
    }
  }
}
