package com.comercio.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Product")
public class Product {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private double price;
    private int stock;
    private int minimumlStock;
    private String observation;
    private int supplierId;

    public Product() {
    }
    
    public Product(Long id, String description, double price, int stock, int minimumlStock, String observation, int supplierId) {
        this.id = id;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.minimumlStock = minimumlStock;
        this.observation = observation;
        this.supplierId = supplierId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }   

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getMinimumlStock() {
        return minimumlStock;
    }

    public void setMinimumlStock(int minimumlStock) {
        this.minimumlStock = minimumlStock;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public int getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(int supplierId) {
        this.supplierId = supplierId;
    }
}

