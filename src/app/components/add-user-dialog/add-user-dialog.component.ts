import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    const emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneregex: RegExp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

    this.formGroup = this.formBuilder.group({
      'firstName': [null, Validators.required],
      'lastName': [null, Validators.required],
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      'phone': [null, [Validators.required, Validators.pattern(phoneregex)]],
      'state': [null, [Validators.required]],
      'city': [null, [Validators.required]],
      'address': [null, [Validators.required]],
      'zip': [null, [Validators.required]]
    });
  }

  getErrorEmail() {
    return this.formGroup.get('email')!.hasError('required') ? 'Field is required' :
      this.formGroup.get('email')!.hasError('pattern') ? 'Not a valid email address' : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close({
      id: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
      firstName: this.formGroup.get('firstName')?.value,
      lastName: this.formGroup.get('lastName')?.value,
      email: this.formGroup.get('email')?.value,
      description: this.formGroup.get('description')?.value,
      phone: this.formGroup.get('phone')?.value,
      address: {
        state: this.formGroup.get('state')?.value,
        city: this.formGroup.get('city')?.value,
        streetAddress: this.formGroup.get('address')?.value,
        zip: this.formGroup.get('zip')?.value
      }
    })
  }
}
