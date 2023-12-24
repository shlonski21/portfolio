import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonSharedModule } from './shared/common-shared.module';
import { AgentBasedModelComponent } from './agent-based-model/agent-based-model.component';
import { ConfigureModalComponent } from './configure-modal/configure-modal.component';
import { LoaderComponent } from './agent-based-model/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    AgentBasedModelComponent,
    ConfigureModalComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
		CommonSharedModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
