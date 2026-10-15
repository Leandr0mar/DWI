package com.dwi.api.helado.sabor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sabores")
public class SaborController {
    private final SaborRepository saborRepository;

    public SaborController(SaborRepository saborRepository) {
        this.saborRepository = saborRepository;
    }

    @GetMapping
    public List<Sabor> listarSabores() {
        return saborRepository.findByActivoTrue();
    }
}
