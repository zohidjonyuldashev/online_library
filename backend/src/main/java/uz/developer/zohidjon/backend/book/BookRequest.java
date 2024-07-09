package uz.developer.zohidjon.backend.book;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record BookRequest(
        Integer id,
        @NotNull(message = "The title of the book must be filled!")
        @NotEmpty(message = "The title of the book must be filled!")
        String title,
        @NotNull(message = "The author name of the book must be filled!")
        @NotEmpty(message = "The author name of the book must be filled!")
        String authorName,
        @NotNull(message = "isbn numbers of the book must be entered!")
        @NotEmpty(message = "isbn numbers of the book must be entered!")
        String isbn,
        @NotNull(message = "The synopsis of the book must be filled!")
        @NotEmpty(message = "The synopsis of the book must be filled!")
        String synopsis,
        boolean shareable) {
}
