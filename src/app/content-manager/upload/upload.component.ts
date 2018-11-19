import { Component, OnInit, Input } from '@angular/core';
import { Upload } from '@shared/interfaces/upload';
import { ContentService } from '@shared/services/content.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Input() file: Upload
  constructor(public contentService: ContentService) { }

  ngOnInit() {
  }

  removeFile(key: string, name: string) {
    if (confirm("Are you sure you want to delete this stored file?") == true) {
      this.contentService.deleteFileStorage(name)
      this.contentService.deleteFileData(key)
    }
  }
}
