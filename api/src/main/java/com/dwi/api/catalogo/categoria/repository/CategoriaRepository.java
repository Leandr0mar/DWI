package com.dwi.api.catalogo.categoria.repository;

import com.dwi.api.catalogo.categoria.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}
