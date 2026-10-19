package com.comercio.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.comercio.api.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}
