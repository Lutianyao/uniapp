export default {
  login: {
    url: 'user/auth/login',
    method: 'POST'
  },
  bind: {
    url: 'user/auth/bind',
    method: 'POST'
  },
  register: {
    url: 'user/auth/register',
    method: 'POST'
  },
  profile: {
    url: 'user/auth/profile',
    method: 'UPLOAD'
  },
  check: {
    url: 'user/base/check',
    method: 'POST'
  },
  wxAvatar: {
    url: 'user/auth/avatar',
    method: 'UPLOAD'
  }
}