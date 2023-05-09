import {Component, OnInit} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  products! : Array<Product>
  currentPage : number=0;
  size : number=5;
  totalPages : number=0;
  currentAction : string="all";
  errMessage! : string;
  searchFormGroup! : FormGroup;
  constructor(private productService : ProductService,
              private fb : FormBuilder) {
  }
  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control(null)
    })
    this.handleGetPageProducts();
  }

  handleGetAllProducts(){
    this.productService.getAllProducts().subscribe({
      next : data => {
        this.products = data;
      },
      error : err => {
        this.errMessage = err;
      }
    });
  }
  handleGetPageProducts(){
    this.productService.getPageProducts(this.currentPage, this.size).subscribe({
      next : (data) => {
        this.products = data.products;
        this.totalPages = data.totalPages;
      },
      error : err => {
        this.errMessage = err;
      }
    });
  }

  handledeleteProduct(p : Product) {
    let conf = confirm("Are you sure ?");
    if(conf==false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next : (data) => {
        //this.handleGetAllProducts()
        let index = this.products.indexOf(p);
        this.products.splice(index, 1)
      }
    });
  }

  handleSetPromotion(p :Product){
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next : (data) => {
        p.promotion = !promo;
      },
      error : (err) => {
        this.errMessage = err;
      }
    })
  }

  handleSearchProduct(){
    this.currentAction = "search";
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProduct(keyword, this.currentPage, this.size).subscribe({
      next : (data) => {
        this.products = data.products;
        this.totalPages = data.totalPages;
      }
    })
  }

  goToPage(i : number){
    this.currentPage = i;
    if(this.currentAction === "all") this.handleGetPageProducts();
    else this.handleSearchProduct();
  }
}
