package com.dwi.api.common.response;

public record ApiResponse(String message) {

    public static final String INVALID_REQUEST = "No se pudo completar la solicitud. Verifica los datos ingresados.";
    public static final String NOT_FOUND = "No se pudo encontrar el recurso solicitado.";
    public static final String CONFLICT = "No se pudo completar la acción solicitada.";
    public static final String UNAUTHORIZED = "Tu sesión no está disponible. Inicia sesión nuevamente.";
    public static final String FORBIDDEN = "No tienes permiso para realizar esta acción.";
    public static final String UNEXPECTED = "Ocurrió un problema. Inténtalo nuevamente más tarde.";

    public static ApiResponse invalidRequest() {
        return new ApiResponse(INVALID_REQUEST);
    }

    public static ApiResponse notFound() {
        return new ApiResponse(NOT_FOUND);
    }

    public static ApiResponse conflict() {
        return new ApiResponse(CONFLICT);
    }

    public static ApiResponse conflict(String message) {
        return new ApiResponse(message);
    }

    public static ApiResponse unauthorized() {
        return new ApiResponse(UNAUTHORIZED);
    }

    public static ApiResponse forbidden() {
        return new ApiResponse(FORBIDDEN);
    }

    public static ApiResponse unexpected() {
        return new ApiResponse(UNEXPECTED);
    }

    public String toJson() {
        String escapedMessage = message
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
        return "{\"message\":\"" + escapedMessage + "\"}";
    }
}
