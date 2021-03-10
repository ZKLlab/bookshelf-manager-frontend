# bookshelf-manager-frontend
开源书架管理 - 前端



```js
|-项目名
    |-public
		|-node_modules //依赖模块
    |-src
      |-config //配置文件
			|-pages
				|-admin
				|-reader //读者端-移动端
          |-assets 
  				|-router //路由信息
          |-store
          |-views
          	|-App.vue 
         	|-main.js
		|-package.json
		|-README.md
```

**读者端 三模块儿**

读者

- 借书还书模块-实现借还书及续借功能前端需要支持移动设备

  - 借书

    - 上传图片，后端识别出所有条码，根据条码找到藏书进行借阅
      - 判断图书是否可借阅，随后进行借阅

  - 还书-只解决书籍放置在正确位置的问题不解决防盗

    - 计算并告知用户放置位置
      - 第×排，××书和××书之间

    - 确认架位放置正确
      - 方案一：书架侧面拍照，通过调库识别条码的相对位置

    - 如果刚借完书就还书（借书时间<=10min）

      - 问用户发生甚么事了

      - 书有问题？借错书了？

      - 做特殊标记，本次借书不会计入推荐和排行榜

- 个人借阅情况查询

  - 续借

  - 对已经归还的图书进行评价
    - 借阅体验如何-管理员可见

- 图书列表查询模块
  - 图书列表

    - 关键字搜索

    - 分类

  - 图书借阅排行-对书进行排序
  - 图书推荐
    - **基于用户的协同过滤推荐**，使用Redis存储数据
