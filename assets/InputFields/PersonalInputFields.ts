let personalDetailsInputs: {
  id?: Number;
  ref?: string;
  inputName: string;
  underlineColorAndroid?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  autoCapitalize?: string;
  returnKeyType?: string;
  blurOnSubmit?: boolean;
  required?: boolean;
  keyboardType?: string;
  defaultValue?: string;
  type?: string;
  maxLength?: number;
}[] = [
  {
    id: 1,
    ref: "firstNameRef",
    inputName: "First Name",
    underlineColorAndroid: "#f000",
    placeholder: "First Name",
    placeholderTextColor: "#8b9cb5",
    autoCapitalize: "sentences",
    returnKeyType: "next",
    keyboardType: "default",
    blurOnSubmit: false,
    required: true,
    type: "text",
    maxLength: 30,
  },
  {
    id: 2,
    ref: "lastNameRef",
    inputName: "Last Name",
    underlineColorAndroid: "#f000",
    placeholder: "Last Name",
    placeholderTextColor: "#8b9cb5",
    autoCapitalize: "sentences",
    returnKeyType: "next",
    keyboardType: "default",
    blurOnSubmit: false,
    required: true,
    type: "text",
    maxLength: 30,
  },
  {
    id: 3,
    ref: "emailRef",
    inputName: "Email Address",
    underlineColorAndroid: "#f000",
    placeholder: "Email Address",
    placeholderTextColor: "#8b9cb5",
    autoCapitalize: "sentences",
    returnKeyType: "next",
    keyboardType: "email-address",
    blurOnSubmit: false,
    required: true,
    type: "email",
    maxLength: 100,
  },
  {
    id: 4,
    ref: "mobileRef",
    inputName: "Mobile No",
    underlineColorAndroid: "#f000",
    placeholder: "Mobile No",
    placeholderTextColor: "#8b9cb5",
    autoCapitalize: "sentences",
    returnKeyType: "next",
    keyboardType: "numeric",
    blurOnSubmit: false,
    required: true,
    type: "text",
    maxLength: 10,

    
  },
  {
    id: 5,
    ref: "businessRef",
    inputName: "Business Name",
    underlineColorAndroid: "#f000",
    placeholder: "Business Name",
    placeholderTextColor: "#8b9cb5",
    autoCapitalize: "sentences",
    returnKeyType: "next",
    keyboardType: "default",
    blurOnSubmit: false,
    required: false,
    type: "text",
    maxLength: 100,

   
  },
];

export default personalDetailsInputs;
