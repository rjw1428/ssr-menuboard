import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Upload } from '@shared/interfaces/upload';
import { storage } from 'firebase/app'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentChangeAction, sortedChanges } from '@angular/fire/firestore';
import { Content } from '@shared/interfaces/content';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  contentList: AngularFirestoreCollection
  contentList$: Observable<Upload[]>
  client: string;
  constructor(private afs: AngularFirestore) { }
  private uploadTask: firebase.storage.UploadTask;
  getFileList(client?: string) {
    this.client = client
    this.contentList = this.afs.collection('clients').doc(client).collection('content')
    this.contentList$ = this.contentList.snapshotChanges().map(vals => {
      return vals.map(val => {
        let x = val.payload.doc.data()
        x['id'] = val.payload.doc.id
        return x as Upload
      })
    })
    return this.contentList$
    // return this.db.list(this.basePath)
  }

  pushUpload(upload: Upload, name: string) {
    this.uploadTask = storage().ref().child(`content/${this.client}/features/${upload.file.name}`).put(upload.file)
    this.uploadTask.on(storage.TaskEvent.STATE_CHANGED,
      (inProgress) => {
        upload.progress = Math.ceil((this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes) * 100)
      },
      (error) => {
        console.log(error)
      },
      () => {
        upload['sourceUrl'] = upload.file.name
        this.uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            let x = Object.assign({ ['displayName']: name, ['fbUrl']: downloadURL, ['dateAdded']: this.timestamp() }, upload)
            delete x.file
            this.contentList.add(x)
          })
      })
  }

  pushUrl(upload: string, name: string) {
    let progress: number
    let x = storage().ref().child(`content/${this.client}/features/${name}`)
    //this.uploadTask = x.put()
    this.uploadTask.on(storage.TaskEvent.STATE_CHANGED,
      (inProgress) => {
        progress = Math.ceil((this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes) * 100)
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            let x = {
              displayName: name,
              fbUrl: downloadURL,
              dateAdded: this.timestamp(),
              sourceUrl: upload,
            }
            this.contentList.add(x)
          })
      })
  }

  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.id)
      .then(() => {
        this.deleteFileStorage(upload.sourceUrl)
      })
      .catch(error => console.log(error))
  }

  deleteFileData(key: string) {
    return this.contentList.doc(key).delete()
  }

  deleteFileStorage(name: string) {
    storage().ref().child(`content/${this.client}/features/${name}`).delete()
  }

  timestamp() {
    return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  }
}
