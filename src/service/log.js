import client from '@/service/client'

export function selectLogList(name, offset, pagesize) {
  const formData = new FormData()
  formData.append('name', name)
  return client.post('/log/list', {
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

export function editLog(log) {
  return client.post('/log/edit', log).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function deleteLog(id) {
  const formData = new FormData()
  formData.append('id', id)
  return client.post('/log/delete', formData).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}
