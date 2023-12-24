import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
	imports: [
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatIconModule,
		MatCardModule,
		MatSidenavModule,
		MatPaginatorModule,
		MatSelectModule,
		MatOptionModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		MatSnackBarModule,
		MatDialogModule,
		MatFormFieldModule,
		MatListModule,
		MatInputModule,
		MatGridListModule,
		MatStepperModule,
		MatChipsModule,
		MatButtonToggleModule,
		MatSlideToggleModule,
		MatTooltipModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatRadioModule,
		MatTabsModule,
		MatSliderModule,
		MatTreeModule,
		MatExpansionModule,
		ScrollingModule,
		DragDropModule
	],
	exports: [
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatIconModule,
		MatCardModule,
		MatSidenavModule,
		MatPaginatorModule,
		MatSelectModule,
		MatOptionModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatAutocompleteModule,
		MatCheckboxModule,
		MatSnackBarModule,
		MatDialogModule,
		MatFormFieldModule,
		MatListModule,
		MatInputModule,
		MatGridListModule,
		MatStepperModule,
		MatChipsModule,
		MatButtonToggleModule,
		MatSlideToggleModule,
		MatTooltipModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatRadioModule,
		MatTabsModule,
		MatSliderModule,
		MatTreeModule,
		MatExpansionModule,
		ScrollingModule,
		DragDropModule
	],
	providers: []
})
export class AngularMaterialModule {
	constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
		matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/images/mdi.svg'));
	}
}
