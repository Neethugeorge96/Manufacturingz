import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { PipesModule } from './pipes/pipes.module'
import { customErrorMessages } from './shared/utils/utils.functions';
import { JwtInterceptor } from './services/auth/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    FormsModule, 
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    PipesModule,
    NgBootstrapFormValidationModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: CUSTOM_ERROR_MESSAGES,
      useValue: customErrorMessages,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
