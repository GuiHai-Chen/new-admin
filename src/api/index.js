import network from './network'

export const loginInfo = (userInfo) => network.post('/mp/v1_0/authorizations', userInfo)
export const personInfo = () => network.get('/mp/v1_0/user/profile')
// 获取素材
export const getImage = (obj) => network.get('/mp/v1_0/user/images', obj)
export const getAllImage = (obj1, obj2) => network.all([getImage(obj1), getImage(obj2)])

export const getArticle = (obj) => network.get('/mp/v1_0/articles', obj)
export const getChannels = () => network.get('/mp/v1_0/channels')
// 凡是看见接口路径中有的 :xxx 格式的字段，则需要传递路径参数
export const delArticle = (articleId) => network.elseMethods(`/mp/v1_0/articles/${articleId}`, 'DELETE')
export const getArticleDetail = (articleId) => network.elseMethods(`/mp/v1_0/articles/${articleId}`, 'GET')
// 无法获取到这个总量,可能是由于后端没有对option进行放行
// export const getArticleCount = () => network.get('/mp/v1_0/statistics/articles')

// 收藏图片
export const collectMaterialImg = (id, obj) => network.elseMethods(`/mp/v1_0/user/images/${id}`, 'PUT', obj)
// 上传素材
export const uploadImage = (obj) => network.post('/mp/v1_0/user/images', obj)
// 删除素材
export const deleteMaterial = (id) => network.elseMethods(`/mp/v1_0/user/images/${id}`, 'DELETE')
// 获取文章是否有打开评论
export const getArticleComment = (obj) => network.get('/mp/v1_0/articles', obj)
// 打开和关闭评论
export const isOpenComment = (id, obj) => network.elseMethods(`/mp/v1_0/comments/status?article_id=${id}`, 'PUT', obj)
// 获取粉丝列表
export const getFansList = () => network.get('/mp/v1_0/followers')
// 设置用户信息
export const setPersonInfo = (userObj, photo) => network.all([
  network.elseMethods('/mp/v1_0/user/profile', 'PATCH', userObj),
  network.elseMethods('/mp/v1_0/user/photo', 'PATCH', photo)
])
// 更改头像
export const setHeaderPhoto = obj => network.elseMethods('/mp/v1_0/user/photo', 'PATCH', obj)
// 发布文章
export const publishArticle = (draft, obj) => network.post(`/mp/v1_0/articles?draft=${draft}`, obj)
// 修改文章
export const updataArticalDetail = (id, obj) => network.elseMethods(`/mp/v1_0/articles/${id}?draft=false`, 'PUT', obj)
