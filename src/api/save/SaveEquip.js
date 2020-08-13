import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getSaveEquip() {
  const url = '/saveAbility/getSaveEquipMainByUser'
  return get(url, {})
}
