import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Upload } from '@shared/interfaces/upload';
import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private db: AngularFireDatabase) { }
  private basePath: string = 'content/features';
  private uploadTask: firebase.storage.UploadTask;

  getFileList() {
    return this.db.list(this.basePath)
  }

  pushUpload(upload: Upload) {
    let storageRef = firebase.storage().ref();
    this.uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file)

    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (inProgress) => {
        upload.progress = Math.ceil((this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes) * 100)
      },
      (error) => {
        console.log(error)
      },
      () => {
        upload.name = upload.file.name
        // this.uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //   upload.url = downloadURL
        // });
        this.uploadTask.snapshot.ref.getDownloadURL().then(url => {
          upload.url = url
          this.db.list(`${this.basePath}/`).push(upload)
        })
      })
  }

  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.key)
      .then(() => {
        this.deleteFileStorage(upload.name)
      })
      .catch(error => console.log(error))
  }

  deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  deleteFileStorage(name: string) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }
}
