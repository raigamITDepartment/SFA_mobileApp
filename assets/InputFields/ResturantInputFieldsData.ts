import { userManagementApi } from "../../services/Api";

export async function BusinessInputFieldsData() {
  let url = `api/auth/vendor/types`;
  let vendorTypes: any = [];
  await userManagementApi()
    .get(url)
    .then((response) => {
      vendorTypes = response.data;
    })
    .catch((err) => {
      console.error(err);
    });

  // console.log(vendorTypes.payload);

  const dropdownList = vendorTypes.payload.reduce((res: any, item: any) => {
    res.push({ label: item.typeName, value: item.id });
    return res;
  }, []);

  const dataList = [
    {
      id: 7,
      ref: "",
      inputName: "Business Category",
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
      ref: "",
      inputName: "Business Name",
      underlineColorAndroid: "#f000",
      placeholder: "",
      placeholderTextColor: "#8b9cb5",
      autoCapitalize: "sentences",
      returnKeyType: "next",
      blurOnSubmit: false,
      required: true,
      keyboardType: "default",
      defaultValue: "",
      type: "text",
    },
    {
      id: 2,
      ref: "",
      inputName: "Business Address Line 1",
      underlineColorAndroid: "#f000",
      placeholder: "",
      placeholderTextColor: "#8b9cb5",
      autoCapitalize: "sentences",
      returnKeyType: "next",
      blurOnSubmit: false,
      required: true,
      keyboardType: "default",
      googlePlacesSearch: true,
      type: "text",
    },
    {
      id: 3,
      ref: "",
      inputName: "Business Address Line 2",
      underlineColorAndroid: "#f000",
      placeholder: "",
      placeholderTextColor: "#8b9cb5",
      autoCapitalize: "sentences",
      returnKeyType: "next",
      blurOnSubmit: false,
      required: false,
      keyboardType: "default",
      googlePlacesSearch: false,
      type: "text",
    },
    {
      id: 4,
      ref: "",
      inputName: "City",
      underlineColorAndroid: "#f000",
      placeholder: "",
      placeholderTextColor: "#8b9cb5",
      autoCapitalize: "sentences",
      returnKeyType: "next",
      blurOnSubmit: false,
      required: true,
      keyboardType: "default",
      type: "text",
    },
    {
      id: 5,
      ref: "",
      inputName: "State",
      underlineColorAndroid: "#f000",
      placeholder: "",
      placeholderTextColor: "#8b9cb5",
      autoCapitalize: "sentences",
      returnKeyType: "next",
      blurOnSubmit: false,
      required: true,
      keyboardType: "default",
      type: "text",
    },
    {
      id: 6,
      ref: "",
      inputName: "PostalCode",
      underlineColorAndroid: "#f000",
      placeholder: "",
      placeholderTextColor: "#8b9cb5",
      autoCapitalize: "sentences",
      returnKeyType: "next",
      blurOnSubmit: false,
      required: false,
      keyboardType: "default",
      type: "text",
    },
  ];
  // const final = [ ...old, ...myjson ];
  return dataList;
}
