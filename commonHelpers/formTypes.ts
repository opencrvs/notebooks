export interface FormField {
  name: string
  [key: string]: any
}

export interface FormGroup {
  id: string
  fields: FormField[]
}

export interface FormSection {
  id: any
  groups: FormGroup[]
}

export interface Form {
  sections: FormSection[]
}

export interface FormCollection {
  [formName: string]: Form
}

export interface FormFieldWithId extends FormField {
  id: string
}
