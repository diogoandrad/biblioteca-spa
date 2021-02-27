import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  get bookFilter(): string {
    return this._bookFilter;
  }
  set bookFilter(value: string) {
    this._bookFilter = value;
    this.booksFiltrados = this.bookFilter ? this.filtrarBooks(this.bookFilter) : this.books;
  }

  booksFiltrados: any = [];

  constructor(private bookService: BookService, private modalService: BsModalService) {
    this.books = [];
  }

  openModalForm(form: TemplateRef<any>, id: string | undefined) {
    this.modalRef = this.modalService.show(form);
    this.idAtual = id;

    if (id)
      this.getBookById(id);
    else
      this.bookInfo = undefined

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

  ngOnInit(): void {
    this.getBooks();
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
    console.log(this.idAtual);
    if (!this.idAtual) { // Adicionar
      console.log(myForm.value.id);
      this.bookService.addBook(myForm.value).subscribe(
        (book: Book) => {
          this.getBooks();
          console.log('Adicionado com Sucesso!');
        },
        (erro: any) => {
          alert("Erro ao salvar os dados!");
          console.log(erro);
        }
      );
    } else { // Editar
      myForm.value.id = this.idAtual;
      this.bookService.updateBook(this.idAtual, myForm.value).subscribe(
        (book: Book) => {
          this.getBooks();
          console.log('Editado com Sucesso!');
        },
        (erro: any) => {
          alert("Erro ao salvar os dados!");
          console.log(erro);
        }
      );
    }
    this.modalRef.hide();
  }

  deleteBook(id: string) {
    this.bookService.deleteBook(id).subscribe(
      (message: string) => {
        this.getBooks();
        console.log('Removido com Sucesso!');
      },
      (erro: any) => {
        console.log(erro);
      }
    );
  }
}
