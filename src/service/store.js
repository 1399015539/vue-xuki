import client from '@/service/client'

export function selectStoreList(name, offset, pagesize) {
  const formData = new FormData()
  formData.append('name', name)
  return client.post('/store/list', {
    offset: offset,
    rows: pagesize
  }, {
    params: {
      name: name
    }
  }).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function editStore(log) {
  return client.post('/store/edit', log).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function deleteStore(id) {
  const formData = new FormData()
  formData.append('id', id)
  return client.post('/store/delete', formData).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}
