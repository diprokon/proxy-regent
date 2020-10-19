import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RequestsTableComponent } from './components/requests-table/requests-table.component';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../environments/environment';
import { RequestsState, ConfigState } from './store';
import { NgxsModule } from '@ngxs/store';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        RequestsTableComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSlideToggleModule,
        MatTableModule,
        MatSortModule,
        MatChipsModule,
        MatIconModule,
        MatButtonModule,
        NgxsModule.forRoot([RequestsState, ConfigState], {
            developmentMode: !environment.production
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
