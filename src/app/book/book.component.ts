import { Component, OnInit, TemplateRef } from '@angular/core';
import { Book } from '../models/book.model';
import { BookService } from '../service/book.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  public books!: Book[];

  public bookInfo!: Book | undefined;

  public modalRef!: BsModalRef;

  public idAtual: string | undefined;

  constructor(private bookService: BookService, private modalService: BsModalService) {
    this.books = [];
  }

  openModalForm(form: TemplateRef<any>, id: string | undefined) {
    this.modalRef = this.modalService.show(form);
    this.idAtual = id;

    if (id) this.getBookById(id);

    console.log(id);
  }

  openModalInfo(info: TemplateRef<any>, id: string | undefined) {
    this.modalRef = this.modalService.show(info);

    if (id)
      this.getBookById(id);
    else
      this.bookInfo = {
        id: '',
        title: '',
        caption: '',
        pages: 0,
        year: 0,
        version: 0,
        authors!: '',
      };

    console.log(id, this.bookInfo);
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.bookService.getBooks().subscribe(
      (books: Book[]) => {
        this.books = books;
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
