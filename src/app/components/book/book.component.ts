import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import  Swal  from 'sweetalert2';

import { Book } from '../../models/book.model';
import { BookService } from '../../service/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books!: Book[];

  bookInfo!: Book | undefined;

  modalRef!: BsModalRef;

  idAtual: string | undefined;

  _bookFilter!: string;

  booksFiltrados: any = [];

  get bookFilter(): string {
    return this._bookFilter;
  }

  set bookFilter(value: string) {
    this._bookFilter = value;
    this.booksFiltrados = this.bookFilter ? this.filtrarBooks(this.bookFilter) : this.books;
  }

  constructor(private bookService: BookService, private modalService: BsModalService) {
    this.books = [];
  }

  ngOnInit(): void {
    this.getBooks();
  }

  openModalForm(form: TemplateRef<any>, id: string | undefined) {
    this.modalRef = this.modalService.show(form);
    this.idAtual = id;

    if (id)
      this.getBookById(id);
    else
      this.bookInfo = undefined;

    console.log(id);
  }

  openModalInfo(info: TemplateRef<any>, id: string | undefined) {
    this.modalRef = this.modalService.show(info);

    if (id)
      this.getBookById(id);
    else
      this.bookInfo = undefined

    console.log(id, this.bookInfo);
  }

  filtrarBooks(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.books.filter(
      book => book.title.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  getBooks() {
    this.bookService.getBooks().subscribe(
      (books: Book[]) => {
        this.books = books;
        this.booksFiltrados = books;
        console.log(books);
      },
      (erro: any) => {
        console.log(erro);
      }
    );
  }

  getBookById(id: string) {
    this.bookService.getBookById(id).subscribe(
      (book: Book) => {
        this.bookInfo = book;
        console.log(book);
      },
      (erro: any) => {
        console.log(erro);
      }
    );
  }

  onSubmit(myForm: NgForm) {
    myForm.value.version = Number(myForm.value.version);

    if (!this.idAtual) { // Adicionar
      this.bookService.addBook(myForm.value).subscribe(
        (book: Book) => {
          Swal.fire({
            title: 'Salvo!',
            text: 'O livro foi adicionado com sucesso.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
          this.getBooks();
        },
        (erro: any) => {
          Swal.fire({
            title: 'Erro!',
            text: 'Erro ao adicionar livro.',
            icon: 'error'
          })
          console.log(erro);
        }
      );
    } else { // Editar
      myForm.value.id = this.idAtual;
      this.bookService.updateBook(this.idAtual, myForm.value).subscribe(
        (book: Book) => {
          Swal.fire({
            title: 'Salvo!',
            text: 'O livro foi editado com sucesso.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
          this.getBooks();
        },
        (erro: any) => {
          Swal.fire({
            title: 'Erro!',
            text: 'Erro ao editar livro.',
            icon: 'error'
          })
          console.log(erro);
        }
      );
    }
    this.modalRef.hide();
  }

  deleteBook(id: string) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "O livro será excluido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.deleteBook(id).subscribe(
          (message: string) => {
            Swal.fire({
              title: 'Excluido!',
              text: 'O livro foi excluido com sucesso.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })
            this.getBooks();
          },
          (erro: any) => {
            Swal.fire({
              title: 'Erro!',
              text: 'Erro ao excluir livro.',
              icon: 'error'
            })
            console.log(erro);
          }
        );
      }
    })
  }
}
