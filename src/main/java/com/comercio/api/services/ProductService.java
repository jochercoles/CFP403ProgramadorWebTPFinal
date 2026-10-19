package com.comercio.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.comercio.api.model.Product;
import com.comercio.api.repositories.ProductRepository;

@Service 
public class ProductService {
    private final ProductRepository _productRepository;
    
    public ProductService(ProductRepository productRepository) {
        _productRepository = productRepository;
    }
    
    public Product readProductById(Long id) {
        return _productRepository.findById(id).get();
    }

    public List<Product> readAllProducts() {
        return _productRepository.findAll();
    }

    public Product createProduct(Product product) {
        // Assign a unique ID to the product
        return _productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = readProductById(id);
        if (product != null)
        {
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            product.setMinimumlStock(updatedProduct.getMinimumlStock());
            product.setObservation(updatedProduct.getObservation());
            product.setSupplierId(updatedProduct.getSupplierId());

            return _productRepository.save(product); 
        }

        return null; // Return null if the product with the given ID was not found
    }

    public void deleteProduct(Long id) {
        Product product = readProductById(id);

        if (product != null)
        {
            _productRepository.delete(product);
        }
    }

    public Optional<List<Product>> readProductsBySupplierId(Long supplierId) {
        Optional<List<Product>> products = _productRepository.findBySupplierId(supplierId);

        if(products.isPresent()) {
            return products;
        }
        else
        {
            throw new RuntimeException("No products found for supplier with ID: " + supplierId);
        }
    }

    public Optional<List<Product>> searchProductsByDescriptionOrObservation(String value) {
        return _productRepository.findByDescriptionContainingIgnoreCaseOrObservationContainingIgnoreCase(value, value);
    }
}
