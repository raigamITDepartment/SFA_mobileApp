let LoginDetailsInputs: {
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
  subType?: string;
  maxLength?: number;
}[] = [
  {
    id: 1,
    ref: "usernameRef",
    inputName: "User Name",
    underlineColorAndroid: "#f000",
    placeholder: "Username",
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
    ref: "passwordRef",
    inputName: "Password",
    underlineColorAndroid: "#f000",
    placeholder: "Password",
    placeholderTextColor: "#8b9cb5",
    autoCapitalize: "sentences",
    returnKeyType: "next",
    keyboardType: "default",
    blurOnSubmit: false,
    required: true,
    type: "password",
  },
  {
    id: 3,
    ref: "passwordConfirmRef",
    inputName: "Confirm Password",
    underlineColorAndroid: "#f000",
    placeholder: "Confirm Password",
    placeholderTextColor: "#8b9cb5",
    autoCapitalize: "sentences",
    returnKeyType: "next",
    keyboardType: "default",
    blurOnSubmit: false,
    required: true,
    type: "password",
    subType: "confirm",
  },
];

export default LoginDetailsInputs;
