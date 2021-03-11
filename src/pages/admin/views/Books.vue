<template>
  <a-table :columns="columns" :data-source="bookListState.list" class="components-table-demo-nested" row-key="id"
           @expand="listenRow">
    <template #subjects="{ text:subjects }">
      {{ subjects.join('—') }}
    </template>
    <template #operation>
      <a>修改</a>
    </template>
    <template #expandedRowRender="{record}">
      <a-table :columns="innerColumns" :data-source="record.holdings" :pagination="false" row-key="id">
        <template #operation="{record:holding}">
          <span class="table-operation">
            <a :download="`${holding.barcode}.png`"
               :href="`/api/label?callNumber=${encodeURIComponent(holding.callNumber)}&barcode=${encodeURIComponent(holding.barcode)}`">下载标签</a>
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item>续借</a-menu-item>
                  <a-menu-item>修改</a-menu-item>
                </a-menu>
              </template>
              <a>
                更多
                <down-outlined />
              </a>
            </a-dropdown>
          </span>
        </template>
      </a-table>
    </template>
  </a-table>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { defineComponent, reactive } from 'vue';


const status = 'success';

const columns = [
  {
    title: '书名',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '出版社',
    dataIndex: 'publisher',
    key: 'publisher',
  },
  {
    title: 'ISBN',
    dataIndex: 'isbn',
    key: 'isbn',
  },
  {
    title: '分类',
    dataIndex: 'subjects',
    key: 'subjects',
    slots: {
      customRender: 'subjects',
    },
  },
  {
    title: '简介',
    dataIndex: 'summary',
    key: 'summary',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'operation',
    slots: {
      customRender: 'operation',
    },
  },
];

/*
const data = [];

for (let i = 0; i < 2; ++i) {
  data.push({
    key: i,
    title: '软件工程导论',
    author: '张海藩，牟永敏编著',
    publisher: '清华大学出版社',
    isbn: '9787302330981',
    subject: '软件工程',
    summary: '本书全面系统地讲述了软件工程的概念、原理和典型的方法学，并介绍了软件项目的管理技术。',
  });
}*/

const innerColumns = [
  {
    title: '条形码',
    dataIndex: 'barcode',
    key: 'barcode',
  },
  {
    title: '地点',
    dataIndex: 'place',
    key: 'place',
  },
  {
    title: '架号',
    dataIndex: 'shelf',
    key: 'shelf',
  },
  {
    title: '行号',
    dataIndex: 'row',
    key: 'row',
  },
  {
    title: '索书号',
    dataIndex: 'callNumber',
    key: 'callNumber',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '修改次数',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    slots: {
      customRender: 'operation',
    },
  },
];
const innerData = [];

for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    barcode: '6824191',
    place: '东区计511',
    state: 'Lending',
    version: 13,
  });
}

export default defineComponent({
  components: {
    DownOutlined,
  },

  setup() {


    const bookListState = reactive({
      loading: false,
      error: false,
      list: [],
    });

    const listenRow = async (expanded, record) => {
      console.log(expanded, record);
      if (expanded) {
        const response = await axios.get(`/api/admin/books/${record.id}/holdings`);
        record.holdings = response.data.data;
      }
    };

    const getBookList = async () => {
      bookListState.loading = true;
      try {
        const response = await axios.get('/api/admin/books');
        bookListState.list = response.data.data;
        bookListState.error = false;
      } catch (e) {
        bookListState.error = true;
      } finally {
        bookListState.loading = false;
      }
      console.log(bookListState.list);
    };

    getBookList();

    return {
      columns,
      innerColumns,
      innerData,
      status,
      getBookList,
      bookListState,
      listenRow,
    };
  },
});
</script>