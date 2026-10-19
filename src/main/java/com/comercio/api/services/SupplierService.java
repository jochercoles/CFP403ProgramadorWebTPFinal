package com.comercio.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.comercio.api.repositories.RoleRepository;
import com.comercio.api.model.Supplier;
import com.comercio.api.repositories.SupplierRepository;

@Service 
public class SupplierService {
    private final SupplierRepository _supplierRepository;
    private final RoleRepository _roleRepository;
    
    public SupplierService(SupplierRepository supplierRepository, RoleRepository roleRepository) {
        _supplierRepository = supplierRepository;
        _roleRepository = roleRepository;
    }

    public Supplier readSupplierById(Long id) {
        return _supplierRepository.findById(id).get();
    }

    public List<Supplier> readAllSuppliers() {
        return _supplierRepository.findAll();
    }

    public Supplier createSupplier(Supplier supplier) {
        validateRole(supplier.getRoleId());
        return _supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier updatedSupplier) {
        validateRole(updatedSupplier.getRoleId());
        Supplier supplier = readSupplierById(id);
        if (supplier != null)
        {
            supplier.setSocialReason(updatedSupplier.getSocialReason());
            supplier.setResponsableName(updatedSupplier.getResponsableName());
            supplier.setResponsableLastName(updatedSupplier.getResponsableLastName());
            supplier.setCuit(updatedSupplier.getCuit());
            supplier.setAddress(updatedSupplier.getAddress());
            supplier.setEmail(updatedSupplier.getEmail());
            supplier.setPhone(updatedSupplier.getPhone());
            if (updatedSupplier.getUsername() != null) {
                supplier.setUsername(updatedSupplier.getUsername());
            }
            if (updatedSupplier.getPassword() != null) {
                supplier.setPassword(updatedSupplier.getPassword());
            }
            supplier.setRoleId(updatedSupplier.getRoleId());

            return _supplierRepository.save((supplier));
        }
        return null; 
    }

    private void validateRole(Long roleId) {
        if (roleId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El rol es obligatorio.");
        }
        if (!_roleRepository.existsById(roleId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El rol indicado no existe.");
        }
    }

    public void deleteSupplier(Long id) {
        Supplier supplier = readSupplierById(id);
        if (supplier != null)
        {
            _supplierRepository.delete(supplier);
        }
    }

    public Optional<Supplier> Login(String email, String password) {
        Optional<Supplier> supplier = _supplierRepository.findByEmailAndPassword(email, password);

        return supplier;
    }
}
