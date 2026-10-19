package com.comercio.api.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RestController;

import com.comercio.api.model.Product;
import com.comercio.api.services.ProductService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping ("/api")
public class ProductController {

    private final ProductService productsService;

    public ProductController(ProductService productsService) {
        this.productsService = productsService;   
    }

    @GetMapping("/products/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productsService.readProductById(id);
    }

    @GetMapping("/products/suppliers/{id}")
    public Optional<List<Product>> getProductsBySupplierId(@PathVariable Long id) {
        return productsService.readProductsBySupplierId(id);
    }   

    @GetMapping("/products")
    public List<Product> getProductos() {
        return productsService.readAllProducts();
    }
     
    @GetMapping("/products/search")
    public List<Product> searchProducts(@RequestParam String value) {
        return productsService.searchProductsByDescriptionOrObservation(value).orElse(List.of());
    }
    

    @PostMapping("/products")
    public Product postProduct(@RequestBody Product entity) {
        
        productsService.createProduct(entity);

        return entity;
    }
    
    @PutMapping("/products/{id}")
    public Product putProduct(@PathVariable Long id, @RequestBody Product entity) {
        //TODO: process PUT request
        productsService.updateProduct(id, entity);

        return entity;
    }

    @DeleteMapping ("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productsService.deleteProduct(id);
    }
}
