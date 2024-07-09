import {Component, OnInit} from '@angular/core';
import {BookRequest} from "../../../../services/models/book-request";
import {BookService} from "../../../../services/services/book.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-manage-book',
  templateUrl: './manage-book.component.html',
  styleUrls: ['./manage-book.component.scss']
})
export class ManageBookComponent implements OnInit {
  errorMsg: Array<string> = [];
  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: ''
  };
  selectedBookCover: any;
  selectedPicture: string | undefined;

  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if (bookId) {
      this.bookService.findBookById({
        'book-id': bookId
      }).subscribe({
        next: (book) => {
          this.bookRequest = {
            id: book.id,
            title: book.title as string,
            authorName: book.authorName as string,
            isbn: book.isbn as string,
            synopsis: book.synopsis as string,
            shareable: book.shareable
          };
          this.selectedPicture = 'data:image/jpg;base64,' + book.cover;
        }
      });
    }
  }

  saveBook() {
    this.errorMsg = [];
    if (!this.selectedBookCover) {
      this.errorMsg.push('Book cover picture must be uploaded.');
      return;
    }

    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next: (bookId) => {
        if (this.selectedBookCover) {
          this.bookService.uploadBookCoverPicture({
            'book-id': bookId,
            body: {file: this.selectedBookCover}
          }).subscribe({
            next: () => this.router.navigate(['/books/my-books']),
            error: (uploadErr) => {
              console.error('Failed to upload cover image:', uploadErr);
              this.errorMsg.push('Failed to upload cover image.');
            }
          });
        } else {
          this.router.navigate(['/books/my-books']);
        }
      },
      error: (err) => {
        console.error('Error saving book:', err.error);
        this.errorMsg = err.error.validationErrors || ['Failed to save book details.'];
      }
    });
  }


  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedBookCover = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

}
