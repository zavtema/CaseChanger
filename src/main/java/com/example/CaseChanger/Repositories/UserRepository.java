package com.example.CaseChanger.Repositories;

import com.example.CaseChanger.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> { // указывается сущность и тип первого параметра (id)
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);
    // вернут true если занят
    Optional<User> findByLogin(String login);
    // Optional - контейнер для значения, которое может быть ноль
}