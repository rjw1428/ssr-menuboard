import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  imgBasePath: string = 'website-images'
  imageList: string[] = []
  priceList = []
  quoteList = []
  constructor(public storage: AngularFireStorage, private firestore: AngularFirestore) {
  }

  ngOnInit() {
    $.fn.visible = function (partial) {
      var $t = $(this),
        $w = $(window),
        viewTop = $w.scrollTop(),
        viewBottom = viewTop + $w.height(),
        _top = $t.offset().top,
        _bottom = _top + $t.height(),
        compareTop = partial === true ? _bottom : _top,
        compareBottom = partial === true ? _top : _bottom;

      return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };

    var win = $(window);
    var phone = $(".app-iphone");


    // Already visible modules
    phone.each(function (i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("already-visible");
      }
    });

    win.scroll(function (event) {
      phone.each(function (i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass("phoneflyup")
        }
      });
    });


    this.getImageList().valueChanges().subscribe(dataList => {
      this.imageList = [];
      dataList.map(imageName => {
        this.getImageUrl(imageName['filename'])
      })
      console.log(this.imageList)
    })

    this.getPriceData().valueChanges().subscribe(dataList => {
      this.priceList = [];
      dataList.map(priceData => {
        this.priceList.push(priceData)
      })
      console.log(this.priceList)
    })

    this.getQuoteData().valueChanges().subscribe(dataList => {
      this.quoteList = [];
      dataList.map(priceData => {
        this.quoteList.push(priceData)
      })
      console.log(this.quoteList)
    })
  }

  getImageList() {
    let imageMetaData: AngularFirestoreCollection<any>
    imageMetaData = this.firestore.collection('website').doc('content').collection('images', ref => {
      return ref
        .where("active", "==", true)
    })
    return imageMetaData
  }

  getImageUrl(name: string) {
    const ref = this.storage.ref(`${this.imgBasePath}/${name}`);
    ref.getDownloadURL()
      .toPromise()
      .then(value => {
        this.imageList.push(value);
      })
      .catch(e => console.log(e))
  }

  getPriceData() {
    let priceData: AngularFirestoreCollection<any>
    priceData = this.firestore.collection('website').doc('content').collection('price', ref => {
      return ref
        .orderBy("order")
    })
    return priceData
  }

  getQuoteData() {
    let quoteData: AngularFirestoreCollection<any>
    quoteData = this.firestore.collection('website').doc('content').collection('quotes', ref => {
      return ref
    })
    return quoteData
  }
}