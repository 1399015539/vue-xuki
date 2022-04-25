import client from './client'
import axios from 'axios'

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Promise<boolean>>}
 */
export function validUsername(str) {
  return client.get('/user/nameList').then(res => {
    return res.data.includes(str)
  }).catch(err => {
    console.error(err)
  })
}

export function validPassword(username, password) {
  return client.get('/user/login', {
    username: username,
    password: password
  }).then(res => {
    return res.code === 2000
  }).catch(err => {
    console.error(err)
  })
}

export function selectUserInfo(username) {
  return client.get('/user/userInfo', {
    username: username
  }).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function selectUser(username, callback) {
  axios.get(' http://localhost:9090/user/userInfo', {
    params: {
      username: username
    }
  }).then(res => {
    typeof callback === 'function' && callback.call(window, res)
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function editUser(user) {
  return client.post('/user/edit', user).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}

export function deleteUser(id) {
  const formData = new FormData()
  formData.append('id', id)
  return client.post('/user/delete', formData).then(res => {
    return res
  }).catch(err => {
    console.error(err)
  })
}
