package com.comercio.api.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.comercio.api.model.Supplier;
import com.comercio.api.services.SupplierService;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController 
@RequestMapping("/api")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping("/suppliers/{id}")
    public Supplier getSupplierById(@PathVariable Long id) {
        return supplierService.readSupplierById(id);
    }
    
    @GetMapping("/suppliers")
    public List<Supplier> getSuppliers() {
        return supplierService.readAllSuppliers();
    }

    @PostMapping("/suppliers")
    public Supplier postSupplier(@RequestBody Supplier supplier) {
        //TODO: process POST request
        return supplierService.createSupplier(supplier);
    }
    
    @PutMapping("/suppliers/{id}")
    public Supplier putSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        //TODO: process PUT request
        return supplierService.updateSupplier(id, supplier);
    }

    @DeleteMapping("/suppliers/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
    }

    @GetMapping("/suppliers/login")
    public Supplier login(@RequestParam String email, @RequestParam String password) {
        Optional<Supplier> supplier = supplierService.Login(email, password);

        if (supplier.isPresent()) {
            return supplier.get();
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                "Email o contraseña incorrectos"
            );
        }
    }
}
