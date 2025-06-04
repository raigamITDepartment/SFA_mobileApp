import { userManagementApi } from "../../services/Api";

export async function PersonalInputFieldsData() {
  let url = `api/auth/user/types`;
  let userTypes: any = [];
  await userManagementApi()
    .get(url)
    .then((response) => {
      userTypes = response.data;
    })
    .catch((err) => {
      console.error(err);
    });

  const dropdownList = userTypes.payload.reduce((res: any, item: any) => {
    //do not add "Restaurant" and "customer" user types into the list
      res.push({ label: item.userTypeName, value: item.userTypeId });
      return res;
     
  }, []);

  const dataList = [
    {
      id: 5,
      ref: "",
      inputName: "User Type",
      underlineColorAndroid: "#f000",
      placeholder: "",
      placeholderTextColor: "#8b9cb5",
      autoCapitalize: "sentences",
      returnKeyType: "next",
      blurOnSubmit: false,
      required: true,
      keyboardType: "default",
      defaultValue: "",
      type: "dropdown",
      dataList: dropdownList,
    },
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
  ];

  return dataList;
}
