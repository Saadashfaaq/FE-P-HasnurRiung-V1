import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpLink } from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { SharedModule } from './modules/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './modules/navigation/navbar/navbar.component';

const uri = environment.apiUrl; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({
      uri: uri,
      extractFiles: (body) => extractFiles(body, isExtractableFile),
    }),
    cache: new InMemoryCache({ addTypename: false }),
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
    SidenavListComponent,
    ToolbarComponent,

    NavbarComponent
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
