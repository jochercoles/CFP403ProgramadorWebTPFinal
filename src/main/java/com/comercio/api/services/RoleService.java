package com.comercio.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.comercio.api.model.Role;
import com.comercio.api.model.Supplier;
import com.comercio.api.repositories.RoleRepository;
import com.comercio.api.repositories.SupplierRepository;

@Service 
public class RoleService {
    private final RoleRepository _roleRepository;
    private final SupplierRepository _supplierRepository;
    
    public RoleService(RoleRepository roleRepository, SupplierRepository supplierRepository) {
        _roleRepository = roleRepository;
        _supplierRepository = supplierRepository;
    }

    public Role readRoleById(Long id) {
        return _roleRepository.findById(id).get();
    }

    public List<Role> readAllRoles() {
        return _roleRepository.findAll();
    }

    public Role createRole(Role role) {
        // Assign a unique ID to the role
        return _roleRepository.save(role);
    }

    public Role updateRole(Long id, Role updatedRole) {
        Role role = readRoleById(id);
        if (role != null)
        {
            role.setDescription(updatedRole.getDescription());

            return _roleRepository.save((role));
        }
        return null; 
    }

    public void deleteRole(Long id) {
        Role role = readRoleById(id);
        Optional<Supplier> supplier = _supplierRepository.findByRoleId(id);

        if (supplier.isPresent())
        {
            throw new IllegalStateException("No puede borrar un role que está asignado a un proveedor.");
        }

        if (role != null)
        {
            _roleRepository.delete(role);
        }
    }
}

