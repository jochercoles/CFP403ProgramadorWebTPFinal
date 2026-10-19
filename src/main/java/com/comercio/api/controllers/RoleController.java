package com.comercio.api.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.comercio.api.model.Role;
import com.comercio.api.services.RoleService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/roles/{id}")
    public Role getMethodName(@PathVariable Long id) {
        return roleService.readRoleById(id);
    }
    
    @GetMapping("/roles")
    public List<Role> getRoles() {
        return roleService.readAllRoles();
    }

    @PostMapping("/roles")
    public Role postMethodName(@RequestBody Role role) {
        return roleService.createRole(role);
    }
    
    @PutMapping("/roles/{id}")
    public Role putMethodName(@PathVariable Long id, @RequestBody Role role) {
        return roleService.updateRole(id, role);
    }

    @DeleteMapping ("/roles/{id}")
    public void deleteMethodName(@PathVariable Long id) {
        roleService.deleteRole(id);
    }
}
