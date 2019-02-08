import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  @Input() quoteList = []
  constructor() { }

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
    var left = $(".comment-left");
    var right = $(".comment-right");
    left.each(function (i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("already-visible");
      }
    });
    right.each(function (i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("already-visible");
      }
    });
    win.scroll(function (event) {
      left.each(function (i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass("flyinLeft")
        }
      });
      right.each(function (i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass("flyinRight")
        }
      });
    })
  }
}
