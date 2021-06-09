import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  apiUrl = 'http://localhost:8000/api/Book';

  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'appplication/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.apiUrl);
  }

  getBookById(id: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(this.apiUrl, book);
  }

  updateBook(id: string, book: Book): Observable<Book> {
    return this.httpClient.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: string): any {
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }
}
