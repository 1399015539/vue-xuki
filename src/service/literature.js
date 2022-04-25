import client from '@/service/client'

export function selectLiteratureList(name, offset, pagesize) {
  const formData = new FormData()
  formData.append('name', name)
  return client.post('/literature/list', {
    offset: offset,
    rows: pagesize
  }, {
    params: {
      name: name
    }
  }).then(res => {
    console.log('response:', res)
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function selectLiteratureDownTop(name, offset, pagesize) {
  const formData = new FormData()
  formData.append('name', name)
  return client.post('/literature/downTopList', {
    offset: offset,
    rows: pagesize
  }, {
    params: {
      name: name
    }
  }).then(res => {
    console.log('response:', res)
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function selectLiteratureStoreTop(name, offset, pagesize) {
  const formData = new FormData()
  formData.append('name', name)
  return client.post('/literature/toreNumTop', {
    offset: offset,
    rows: pagesize
  }, {
    params: {
      name: name
    }
  }).then(res => {
    console.log('response:', res)
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function editLiterature(literature) {
  return client.post('/literature/edit', literature).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function deleteLiterature(id) {
  const formData = new FormData()
  formData.append('id', id)
  return client.post('/literature/delete', formData).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function selectLiteratureById(id) {
  const formData = new FormData()
  formData.append('id', id)
  return client.post('/literature/selectById', formData).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}
