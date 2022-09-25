import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loading',
  templateUrl: './skeleton-loading.page.html',
  styleUrls: ['./skeleton-loading.page.scss'],
})
export class SkeletonLoadingPage implements OnInit {

  items = [0, 1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
  }

}
