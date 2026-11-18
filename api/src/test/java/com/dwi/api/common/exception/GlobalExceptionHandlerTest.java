package com.dwi.api.common.exception;

import com.dwi.api.common.response.ApiResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void conflictResponseDoesNotExposeExceptionDetails() {
        var response = handler.handleIllegalState(new IllegalStateException("Sensitive database details"));

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(ApiResponse.CONFLICT, response.getBody().message());
        assertNotEquals("Sensitive database details", response.getBody().message());
    }

    @Test
    void unexpectedErrorUsesThePredefinedGenericMessage() {
        var response = handler.handleUnexpected(new RuntimeException("Internal stack details"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(ApiResponse.UNEXPECTED, response.getBody().message());
    }

    @Test
    void serializesGenericSecurityResponsesAsJson() {
        assertEquals(
                "{\"message\":\"No tienes permiso para realizar esta acción.\"}",
                ApiResponse.forbidden().toJson());
    }
}
