export const url = 'https://api.novaposhta.ua/v2.0/json/';

export const bodyCities = {
    apiKey: 'e5c882f5fc6c99aa6551be70c30e9f6f',
    modelName: 'Address',
    calledMethod: 'getCities',
    methodProperties: {
      Page: '1',
      Limit: 60
    }
  };
 export const bodySearchCity = {
      apiKey: "e5c882f5fc6c99aa6551be70c30e9f6f",
      modelName: "Address",
      calledMethod: "searchSettlements",
      methodProperties: {
          Page: '1',
          CityName: 'Зап',
          Limit: 20
      }
  }
 export const bodyWarehouses = {
      apiKey: "e5c882f5fc6c99aa6551be70c30e9f6f",
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: ""
      }
  }

  //   CityRef: "db5c88c6-391c-11dd-90d9-001a92567626"