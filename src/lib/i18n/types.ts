import "i18next";
import "react-i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    enableSelector: false;
    returnNull: false;
  }
}

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    enableSelector: false;
    returnNull: false;
  }
}
