package com.comercio.api.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comercio.api.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByEmailAndPassword(String email, String password);
    Optional<Supplier> findByRoleId(Long roleId);
}
