package com.comercio.api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comercio.api.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<List<Product>> findBySupplierId(Long supplierId);
    Optional<List<Product>> findByDescriptionContainingIgnoreCaseOrObservationContainingIgnoreCase(String description, String observation);
}
