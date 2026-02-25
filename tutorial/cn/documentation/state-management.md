# 状态管理

## 什么是状态

组件或页面模块，自身上的 data，就属于它的状态。这个状态只能在组件上使用。

当有多个组件或页面，需要共享一份状态时，如果按照传统的方式，就必须想办法去通知另一个模块，将数据抛过去给它，才能让它共享状态。

所以就需要状态管理，通过定一个一个共享的状态对象，让多个组件或页面模块，都可以访问到这个状态对象，从而实现状态的共享。

## 生成状态对象

通过 `$.stanz({})` 来生成一个状态对象。当组件或页面模块进入 attached 生命周期时，就可以把这个共享的状态对象，设置到当前组件或页面模块的一个key上，作为对象值添加到当前组件或页面模块。

<o-playground style="--editor-height: 500px">
  <code path="demo.html" preview unimportant>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js" unimportant>
    // 应用首页地址
    export const home = "./list.html";
    // 页面切换动画配置
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="data.js">
  export const data = $.stanz({
    list: [{
        id: 10010,
        name: "皮特",
        info: "每一天都是新的开始，阳光总在风雨后。",
    },{
        id: 10020,
        name: "迈克",
        info: "生活就像海洋，只有意志坚强的人才能到达彼岸。",
    },{
        id: 10030,
        name: "约翰",
        info: "成功的秘诀在于坚持自己的梦想，永不放弃。",
    }]
  });
  // await fetch("/list.api").then(e=>e.json()).then(list=>data.list = list)
  </code>
  <code path="list.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <ul>
        <o-fill :value="list">
          <li>
          Name: {{$data.name}} <button on:click="$host.gotoDetail($data)">Detail</button>
          </li>
        </o-fill>
      </ul>
      <script>
        export default async ({load}) => {
          const { data } = await load("./data.js");
          return {
            data: {
              list:[]
            },
            proto:{
                gotoDetail(user){
                    this.goto(`./detail.html?id=${user.id}`);
                }
            },
            attached(){
              this.list = data.list;
            }
          };
        };
      </script>
    </template>
  </code>
  <code path="detail.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
        .avatar{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgba(204, 204, 204, 1);
            color: rgba(58, 58, 58, 1);
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <div style="display: flex; flex-direction: column; align-items: center;text-align: center;">
        <div class="avatar">Avatar</div>
        <div style="font-size: 24px;">UserName: 
          <o-if :value="editorMode">
            <input type="text" sync:value="userData.name"/>
            <button on:click="editorMode = false">✅</button>
          </o-if>
          <o-else>
            <span>{{userData.name}}</span>
            <button on:click="editorMode = true">🖊️</button>
          </o-else>
        </div>
        <div style="font-size: 16px;">UserID: {{userData.id}}</div>
        <p style="font-size: 14px;">{{userData.info}}</p>
      </div>
      <script>
        export default async ({ load,query }) => {
          const { data } = await load("./data.js");
          return {
            data: {
              userData:{},
              editorMode:false
            },
            attached(){
              this.userData = data.list.find(e=>e.id == query.id);
            },
            detached(){
              this.userData = {}; // 组件销毁时，清空挂载的状态数据
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

