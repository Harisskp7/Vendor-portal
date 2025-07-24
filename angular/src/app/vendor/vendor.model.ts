export interface VendorLogin {
  CUSTOMER_ID: string;
  PASSWORD: string;
}

// vendor.model.ts
export interface VendorProfile {
  Lifnr: string;
  Name1: string;
  Land1: string;
  Ort01: string;
  Stras: string;
  Pstlz: string;
}
export interface RFQ {
  Lifnr: string;
  Ebeln: string;
  Aedat: string;
  Bedat: string;
  Ekorg: string;
  Matnr: string;
  Ktmng: string;
  Netpr: string;
  Statu: string;
  Txz01: string;
}
export interface PO {
  Lifnr: string;
  Ebeln: string;
  Aedat: string;
  Bedat: string;
  Ekorg: string;
  Matnr: string;
  Ktmng: string;
  Netpr: string;
  Statu: string;
  Txz01: string;
  Bstyp: string;
}


export interface GR{
      Mblnr: string,
      Mjahr: string,
      Matnr: string,
      Menge: string,
      Werks: string,
      Meins: string,
      BudatMkpf: string,
      Lifnr: string,
}

export interface INV {
      Lifnr: string,
      Belnr: string,
      Budat: string,
      Gjahr: string,
      Waers: string,
      Rmwwr: string,
      Matnr: string,
      Txz01: string,
      Name1: string
}

export interface PAY {
      Lifnr: string,
      Belnr: string,
      Gjahr: string,
      Buzei: string,
      Wrbtr: string,
      Zfbdt: string,
      Budat: string,
      Waers: string,
      Bldat: string,
      Aging: number,
}

export interface MEMO {
      Lifnr: string,
      Vbeln: string,
      Gjahr: string,
      Budat: string,
      Cpudt: string,
      Blart: string,
      Netwr: string,
      Waerk: string,
}


export interface DashboardTile {
  title: string;
  count: number;
  route: string;
  color: string;
}