package com.dwi.api.helado;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping ("/api/helados")
@CrossOrigin(origins = "http://localhost:5173") 
public class HeladoController {
    
    private final HeladoService heladoService;

    public HeladoController(HeladoService heladoService) {
        this.heladoService = heladoService;
    }
    
    @GetMapping("/listar")
    public List<Helado> ListarHelados() {
        return heladoService.listarTodos();
    }
    
}