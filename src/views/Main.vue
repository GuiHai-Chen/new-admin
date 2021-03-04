<template>
  <div id="Main">
    <Aside>
      <Home></Home>
      <Article></Article>
      <Comment></Comment>
      <Content></Content>
      <Fans></Fans>
      <Material></Material>
      <Personset></Personset>
        <div slot="main" class="outputMain">
          <router-view></router-view>
        </div>
    </Aside>
  </div>
</template>

<script>
import Aside from '../components/Aside-header'
import Home from '../components/Home'
import Article from '../components/Article'
import Comment from '../components/Comment'
import Content from '../components/Content'
import Fans from '../components/Fans'
import Material from '../components/Material'
import Personset from '../components/Personset'
export default {
  name: 'Home',
  components: {
    Aside,
    Home,
    Article,
    Comment,
    Content,
    Fans,
    Material,
    Personset
  }
}
</script>

<style scoped lang="scss">
  #Main{
    width: 100%;
    height: 100%;
    .outputMain{
      max-width: 1920px;
    }
  }
</style>
