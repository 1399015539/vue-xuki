import client from '@/service/client'

export function selectUserList(name, offset, pagesize) {
  const formData = new FormData()
  formData.append('name', name)
  return client.post('/user/list', {
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

export function search(name) {
  return client.get('/user/search', {
    name: name
  }).then(res => {
    return res.data
  }).catch(err => {
    console.error(err)
  })
}
