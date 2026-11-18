package com.dwi.api.oferta.service;

import com.dwi.api.catalogo.producto.model.Producto;
import com.dwi.api.catalogo.producto.repository.ProductoRepository;
import com.dwi.api.common.exception.ResourceNotFoundException;
import com.dwi.api.oferta.dto.OfertaAdminDTO;
import com.dwi.api.oferta.dto.OfertaProductoProjection;
import com.dwi.api.oferta.dto.OfertaRequestDTO;
import com.dwi.api.oferta.model.Oferta;
import com.dwi.api.oferta.repository.OfertaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class OfertaService {

    private static final ZoneId BUSINESS_TIME_ZONE = ZoneId.of("America/Lima");

    private final OfertaRepository ofertaRepository;
    private final ProductoRepository productoRepository;

    public OfertaService(OfertaRepository ofertaRepository, ProductoRepository productoRepository) {
        this.ofertaRepository = ofertaRepository;
        this.productoRepository = productoRepository;
    }

    public List<OfertaAdminDTO> listar() {
        return ofertaRepository.findAllByOrderByFechaInicioDesc().stream().map(this::toDto).toList();
    }

    public OfertaAdminDTO obtener(Long id) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta no encontrada."));
        return toDto(oferta);
    }

    public OfertaAdminDTO crear(OfertaRequestDTO request) {
        validarRango(request.fechaInicio(), request.fechaFin());
        List<Producto> productos = obtenerProductos(request.productoIds());
        validarSolapamientos(productos, request.fechaInicio(), request.fechaFin(), null);

        Oferta oferta = new Oferta();
        aplicarDatos(oferta, request, productos);
        Oferta guardada = ofertaRepository.save(oferta);
        productos.forEach(producto -> producto.getOfertas().add(guardada));
        return toDto(guardada);
    }

    public OfertaAdminDTO actualizar(Long id, OfertaRequestDTO request) {
        validarRango(request.fechaInicio(), request.fechaFin());
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta no encontrada."));
        List<Producto> productos = obtenerProductos(request.productoIds());
        validarSolapamientos(productos, request.fechaInicio(), request.fechaFin(), id);

        Set<Long> productoIds = request.productoIds();
        oferta.getProductos().removeIf(producto -> {
            boolean removido = !productoIds.contains(producto.getId());
            if (removido) producto.getOfertas().remove(oferta);
            return removido;
        });
        productos.forEach(producto -> producto.getOfertas().add(oferta));
        aplicarDatos(oferta, request, productos);
        return toDto(ofertaRepository.save(oferta));
    }

    public void eliminar(Long id) {
        Oferta oferta = ofertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta no encontrada."));
        oferta.getProductos().forEach(producto -> producto.getOfertas().remove(oferta));
        oferta.getProductos().clear();
        ofertaRepository.save(oferta);
        ofertaRepository.flush();
        ofertaRepository.delete(oferta);
    }

    public void sincronizarOfertasDeProducto(Producto producto, Set<Long> ofertaIds) {
        Set<Long> idsSolicitados = ofertaIds == null ? Set.of() : ofertaIds;
        List<Oferta> ofertasActuales = ofertaRepository.findAllByProductos_Id(producto.getId());
        List<Oferta> ofertasSeleccionadas = idsSolicitados.isEmpty()
                ? List.of()
                : ofertaRepository.findAllById(idsSolicitados);
        if (ofertasSeleccionadas.size() != idsSolicitados.size()) {
            throw new ResourceNotFoundException("Una o más ofertas no existen.");
        }
        validarOfertasSeleccionadas(ofertasSeleccionadas);

        Set<Long> idsSeleccionados = new HashSet<>(idsSolicitados);
        ofertasActuales.stream()
                .filter(oferta -> !idsSeleccionados.contains(oferta.getId()))
                .forEach(oferta -> oferta.getProductos().removeIf(actual -> actual.getId().equals(producto.getId())));
        ofertasSeleccionadas.forEach(oferta -> oferta.getProductos().add(producto));

        List<Oferta> cambios = new ArrayList<>(ofertasActuales);
        ofertasSeleccionadas.stream()
                .filter(oferta -> cambios.stream().noneMatch(actual -> actual.getId().equals(oferta.getId())))
                .forEach(cambios::add);
        ofertaRepository.saveAll(cambios);
        producto.setOfertas(new HashSet<>(ofertasSeleccionadas));
    }

    public List<OfertaProductoProjection> listarAsignaciones(Collection<Long> productoIds) {
        if (productoIds == null || productoIds.isEmpty()) return List.of();
        return ofertaRepository.findAssignmentsByProductIds(productoIds);
    }

    public List<OfertaProductoProjection> listarVigentes(Collection<Long> productoIds) {
        if (productoIds == null || productoIds.isEmpty()) return List.of();
        return ofertaRepository.findEffectiveOffersByProductIds(productoIds, fechaActual());
    }

    public static LocalDate fechaActual() {
        return LocalDate.now(BUSINESS_TIME_ZONE);
    }

    private void aplicarDatos(Oferta oferta, OfertaRequestDTO request, List<Producto> productos) {
        oferta.setNombre(request.nombre().trim());
        oferta.setPorcentaje(request.porcentaje());
        oferta.setFechaInicio(request.fechaInicio());
        oferta.setFechaFin(request.fechaFin());
        oferta.setProductos(new HashSet<>(productos));
    }

    private List<Producto> obtenerProductos(Set<Long> productoIds) {
        List<Producto> productos = productoRepository.findAllById(productoIds);
        if (productos.size() != productoIds.size()) {
            throw new ResourceNotFoundException("Uno o más productos no existen.");
        }
        return productos;
    }

    private void validarRango(LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio == null || fechaFin == null || fechaFin.isBefore(fechaInicio)) {
            throw new IllegalArgumentException("El rango de fechas de la oferta no es válido.");
        }
    }

    private void validarSolapamientos(List<Producto> productos, LocalDate fechaInicio, LocalDate fechaFin, Long excluirId) {
        if (productos.isEmpty()) return;
        List<Long> productoIds = productos.stream().map(Producto::getId).toList();
        if (!ofertaRepository.findOverlappingOfferIds(productoIds, fechaInicio, fechaFin, excluirId).isEmpty()) {
            throw new IllegalArgumentException("Un producto ya tiene otra oferta en ese rango de fechas.");
        }
    }

    private void validarOfertasSeleccionadas(List<Oferta> ofertas) {
        for (int first = 0; first < ofertas.size(); first++) {
            Oferta oferta = ofertas.get(first);
            for (int second = first + 1; second < ofertas.size(); second++) {
                Oferta siguiente = ofertas.get(second);
                boolean seSolapan = !oferta.getFechaInicio().isAfter(siguiente.getFechaFin())
                        && !siguiente.getFechaInicio().isAfter(oferta.getFechaFin());
                if (seSolapan) {
                    throw new IllegalArgumentException("Un producto no puede tener ofertas con fechas superpuestas.");
                }
            }
        }
    }

    private OfertaAdminDTO toDto(Oferta oferta) {
        LocalDate hoy = fechaActual();
        String estado = hoy.isBefore(oferta.getFechaInicio()) ? "PROGRAMADA"
                : hoy.isAfter(oferta.getFechaFin()) ? "FINALIZADA" : "VIGENTE";
        List<Producto> productos = oferta.getProductos().stream()
                .sorted((left, right) -> left.getNombre().compareToIgnoreCase(right.getNombre()))
                .toList();
        return new OfertaAdminDTO(
                oferta.getId(),
                oferta.getNombre(),
                oferta.getPorcentaje(),
                oferta.getFechaInicio(),
                oferta.getFechaFin(),
                productos.stream().map(Producto::getId).toList(),
                productos.stream().map(Producto::getNombre).toList(),
                estado);
    }
}
