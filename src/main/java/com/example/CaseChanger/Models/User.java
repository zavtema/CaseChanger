package com.example.CaseChanger.Models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users",uniqueConstraints = @UniqueConstraint(columnNames = {"login", "email"}))
@Data
public class User{
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email",nullable = false,length = 100)
    private String email;

    @Column(name = "login", nullable = false,length = 20)
    private String login;

    @Column(name = "password", nullable = false, length = 100)
    private String password;
}