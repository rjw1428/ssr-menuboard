import { Component, OnInit } from '@angular/core';
import { ContentService } from '@shared/services/content.service';
import { Upload } from '@shared/interfaces/upload';


@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.css']
})
export class ContentManagerComponent implements OnInit {
  currentUpload: Upload
  selectedFiles: FileList;
  fileList: Upload[]=[]
  constructor(public contentService: ContentService) { }

  ngOnInit() {
    this.contentService.getFileList().snapshotChanges().forEach(fileList => {
      this.fileList = []
      fileList.forEach(element => {
        var y = element.payload.toJSON() as Upload;
        y['key'] = element.key
        this.fileList.push(y)
      })
    })
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file)
    console.log(this.currentUpload.dateAdded)
    this.contentService.pushUpload(this.currentUpload)
  }
}
