package com.comercio.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "Supplier")
public class Supplier {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String socialReason;
    private String responsableLastName;
    private String responsableName;
    private String phone;
    private String email;
    private String address;
    private String cuit;
    private Long roleId;

    public Supplier() {
    }

    public Supplier(Long id, String username, String password, String socialReason, String responsableLastName, String responsableName, String phone, String email, String address, String cuit, Long roleId) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.socialReason = socialReason;
        this.responsableLastName = responsableLastName;
        this.responsableName = responsableName;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.cuit = cuit;
        this.roleId = roleId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getSocialReason() {
        return socialReason;
    }

    public void setSocialReason(String socialReason) {
        this.socialReason = socialReason;
    }

    public String getResponsableLastName() {
        return responsableLastName;
    }

    public void setResponsableLastName(String responsableLastName) {
        this.responsableLastName = responsableLastName;
    }

    public String getResponsableName() {
        return responsableName;
    }

    public void setResponsableName(String responsableName) {
        this.responsableName = responsableName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCuit() {
        return cuit;
    }

    public void setCuit(String cuit) {
        this.cuit = cuit;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
}
