package com.example.CaseChanger.Repositories;

import com.example.CaseChanger.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> { // указывается сущность и тип первого параметра (id)
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);
    // вернут true если занят
}
