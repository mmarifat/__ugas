export interface IImports {
  province: string
  district: string
  ministry: string
  employeeNo: string
  manNo: string
  nrcNo: string
  names: string
  referenceNo: string
  periodName: string
  subTotal: number | string
  total: number | string
  empNo: number | string
  recNo: number | string
}

export enum EImports {
  province = 'province',
  district = 'district',
  ministry = 'ministry',
  employeeNo = 'employeeNo',
  manNo = 'manNo',
  nrcNo = 'nrcNo',
  names = 'names',
  referenceNo = 'referenceNo',
  periodName = 'periodName',
  subTotal = 'subTotal',
  total = 'total',
  empNo = 'empNo',
  recNo = 'recNo',
}

export enum ResponseStatus {
  SUCCESS = 200,
  FAILED = 204,
  ERROR = 400,
  SESSION_EXPIRED = 401,
  ACCESSDENIED = 403,
  INVALID = 404
}

export function capitilizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
