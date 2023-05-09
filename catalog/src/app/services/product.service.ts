import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {PageProduct, Product} from "../model/product.model";
import {UUID} from "angular2-uuid";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products! : Product[];
  constructor() {
    this.products = [
      {id:UUID.UUID() ,name:"DELL",price:14000,promotion:true},
      {id:UUID.UUID()  ,name:"MAC",price:14000,promotion:false},
      {id:UUID.UUID()  ,name:"HP",price:14000,promotion:true},
      {id:UUID.UUID()  ,name:"Asus",price:14000,promotion:false}
    ];
    for (let i = 0; i < 10; i++) {
      this.products.push(
        {id:UUID.UUID() ,name:"DELL",price:14000,promotion:true},
        {id:UUID.UUID()  ,name:"MAC",price:14000,promotion:false},
        {id:UUID.UUID()  ,name:"HP",price:14000,promotion:true},
        {id:UUID.UUID()  ,name:"Asus",price:14000,promotion:false}
      )
    }
  }


  public getAllProducts() : Observable<Array<Product>>{
    /*let rnd = Math.random();
    if(rnd>0.5) return throwError(()=>new Error("Bad Connexion !"));
    else */
    return of(this.products);
  }

  public getPageProducts(page:number , size:number) : Observable<PageProduct>{
    let start = page*size;
    let totalPages = ~~(this.products.length/size);
    if(totalPages%2 != 0) totalPages++;
    let pageProducts = this.products.slice(start, start+size)
    return of({page:page, size:size, totalPages:totalPages, products:pageProducts});
  }

  public deleteProduct(id : string) : Observable<boolean>{
      this.products = this.products.filter(p => p.id != id);
      return of(true);
  }

  public setPromotion(id : string) : Observable<boolean>{
    let product = this.products.find(p => p.id == id);
    if(product != undefined){
      product.promotion = !product.promotion;
      return of(true);
    } else return throwError(()=> new Error("Product Not Found !"));
  }

  public searchProduct(keyword : string, page:number , size:number) : Observable<PageProduct>{
    let result = this.products.filter(p => p.name.includes(keyword));
    let start = page*size;
    let totalPages = ~~(result.length/size);
    if(totalPages%2 != 0) totalPages++;
    let pageProducts = result.slice(start, start+size)
    return of({page:page, size:size, totalPages:totalPages, products:pageProducts});
  }

}
