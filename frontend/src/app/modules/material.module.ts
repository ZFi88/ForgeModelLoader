import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule, MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatSnackBarModule, MatAutocomplete, MatAutocompleteModule, MatProgressBarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule,
    MatChipsModule,
    MatToolbarModule,
    MatMenuModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressBarModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatListModule,
    MatChipsModule,
    MatToolbarModule,
    MatMenuModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressBarModule
  ],
  declarations: []
})
export class MaterialModule {
}
