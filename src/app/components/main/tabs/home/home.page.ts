import { Component, OnInit } from '@angular/core';

// import { AdMob } from '@admob-plus/ionic/ngx';
import { Platform } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';

import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/main/pages/product.service';
import { CategoryService } from 'src/app/services/main/pages/category.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  cart: any[] = this._utilsService.cart;
  loadingProducts: boolean = false;
  slideOptions = {
    initialSlide: 1,
    speed: 800,
  };
  math = Math;
  searchTerm: string;
  results: any[];
  showResults: boolean = false;
  loadingSearch: boolean = false;
  noResultsFilterByCategory: boolean = false;
  isFilteredByCategory: boolean = false;

  constructor(
    private _platform: Platform,
    // private _admob: AdMob,
    private _productService: ProductService,
    private _categotyService: CategoryService,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }

  filterCategory(id: string) {
    this.isFilteredByCategory = true;
    this.loadingProducts = true;
    this._utilsService.getElements('product').toPromise().then(products => {
      products = products.filter(el => el.category == id);

      this.products = [];
      this.getImages(products);
      this.products.push(...products);

      // Sin resultados
      if (this.products.length == 0) {
        this.loadingProducts = false;
        this.noResultsFilterByCategory = true;
        return;
      }

      this.noResultsFilterByCategory = false;
      this.loadingProducts = false;
    })
  }

  search(event) {
    this.searchTerm = event.target.value;
    if (!this.searchTerm) {
      this.showResults = false;
      this.results = [];
      return;
    };

    if (event.key === 'Enter' || event.keyCode === 13) {
      this.showResults = true;
      this.loadingSearch = true;
      this._productService.search(this.searchTerm).then(products => {
        this.results = [];
        this.getImages(products);
        this.results.push(...products);
        this.loadingSearch = false;
      });
    }
  }

  resetSearch() {
    this.searchTerm = '';
    (document.getElementById('search') as HTMLInputElement).value = '';
    this.showResults = false;
    this.results = [];
  }

  getProducts() {
    this.loadingProducts = true;
    this._productService.load(10).valueChanges().subscribe(products => {
      this.products = [];
      this.getImages(products);
      this.products.push(...products);
      this.loadingProducts = false;
    })
  }

  getCategories() {
    this._categotyService.load(5).valueChanges().subscribe(categories => {
      this.categories = [];
      this.getImages(categories);
      this.categories.push(...categories);
    })
  }

  loadMoreProducts(event) {
    let lastKey = this.products[this.products.length - 1].id;
    if (this.loadingProducts) { return; }
    if (!lastKey) { return; }

    this._productService.loadNext(10, lastKey).valueChanges().subscribe(products => {
      this.getImages(products);
      this.products.push(...products);
      event.target.complete();
    })
  }

  getImages(items) {
    items.forEach((el: any) => {
      if (!el.image) { return null }
      return this._productService.getImage(el.image).then(src => src ? el.image = src : el.image = null).catch(() => el.image = null);
    });
  }

  infiteScroll(event) {
    const position = event.detail.scrollTop;
    const maxHeight = (document.documentElement.scrollHeight || document.body.scrollHeight);

    // Infinite scroll, determine if current position is greater than maxHeight
    if (position + 200 > maxHeight) {
      this.loadMoreProducts(event);
    }
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }
}
