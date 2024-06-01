import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpLink } from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
import { setContext } from '@apollo/client/link/context';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './modules/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './modules/navigation/navbar/navbar.component';
import { SidebarComponent } from './modules/navigation/sidebar/sidebar.component';

// Fungsi untuk membuat ApolloClientOptions dengan otorisasi
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  // Middleware untuk menambahkan token ke header Authorization
  const authLink = setContext((_, { headers }) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token'); // Ambil token dengan key 'token'
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '', // Tambahkan token ke header Authorization
      },
    };
  });

  // Link HTTP untuk GraphQL server
  const http = httpLink.create({
    uri: environment.apiUrl, // URI dari server GraphQL
    extractFiles: (body) => extractFiles(body, isExtractableFile),
  });

  // Gabungkan authLink dan httpLink
  const link = ApolloLink.from([authLink, http]);

  return {
    link,
    cache: new InMemoryCache({ addTypename: false }), // Cache untuk Apollo Client
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    ApolloModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NavbarComponent,
    SidebarComponent
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
