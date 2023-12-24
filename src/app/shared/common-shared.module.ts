import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
	declarations: [],
	imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule, AngularMaterialModule],
	exports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule, AngularMaterialModule]
})
export class CommonSharedModule {}
