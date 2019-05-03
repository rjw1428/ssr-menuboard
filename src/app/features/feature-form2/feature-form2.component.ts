import { Component, OnInit, Inject } from '@angular/core';
import { FeaturedItem } from '@shared/interfaces/featured-item';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Upload } from '@shared/interfaces/upload';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '@shared/services/content.service';
import { Observable } from 'rxjs';
import { UploadFormComponent } from 'app/content-manager/upload-form/upload-form.component';

@Component({
  selector: 'app-feature-form2',
  templateUrl: './feature-form2.component.html',
  styleUrls: ['./feature-form2.component.css']
})
export class FeatureForm2Component implements OnInit {
  selected: FeaturedItem
  contentList: Observable<Upload[]>
  featureForm: FormGroup
  layouts: { name: string, value: string }[] = [
    { name: 'Left', value: 'left' },
    { name: 'Right', value: 'right' },
    { name: 'No Text', value: 'notext' },
    { name: 'Text Over - Left', value: 'textover' },   
    { name: 'Text Over - Right', value: 'textover2' },
    { name: 'Bottom Line', value: 'oneline' }
  ]
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FeatureForm2Component>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public contentService: ContentService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public input: any) {
    this.buildForm()
  }

  ngOnInit() {
    console.log(this.input)
    this.contentList = this.contentService.contentList$
    // this.featureForm.get('imgUrl').value
  }
  onAdd() {
    return this.featureForm.value
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  buildForm() {
    this.featureForm = this.fb.group({
      pageTitle: [this.input.pageTitle ? this.input.pageTitle : '', [Validators.required]],
      itemTitle: this.input.itemTitle ? this.input.itemTitle : '',
      itemCaption: this.input.itemCaption ? this.input.itemCaption : '',
      startDate: this.input.startDate ? this.input.startDate : '',
      endDate: this.input.endDate ? this.input.endDate : '',
      img: this.input.img ? this.input.img : '',
      active: this.input.active != undefined ? this.input.active : true,
      layout: [this.input.layout ? this.input.layout : '', [Validators.required]],
    })
  }

  openContentDialog() {
    const dialogRef = this.dialog.open(UploadFormComponent, {
      width: '500px',
      disableClose: true,
      data: {} //SET OUTPUT DATA KEYS
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(`File ${result.sourceUrl} has been uploaded successfully.`, "OK", {
          duration: 3000,
        })
      }
    })
  }

  getPreviewSource() {
    let source = this.featureForm.get('img').value as Upload
    return source.fbUrl
  }

  isSourceImage() {
    let source = this.featureForm.get('img').value as Upload
    if (source.sourceUrl != null) {
      if (source.sourceUrl.substring(source.sourceUrl.length - 4) == '.mp4')
        return false
      return true
    }
    return true
  }
}
