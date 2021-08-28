<template>
  <a-table :columns="columns" :data-source="bookListState.list" class="components-table-demo-nested" row-key="id"
           @expand="listenRow">
    <template #expandedRowRender="{record}">
      <a-table :columns="innerColumns" :data-source="record.holdings" :pagination="false" row-key="id">
        <template #operation="{record:holding}">
          <span class="table-operation">
            <a :download="`${holding.barcode}.png`"
               :href="`/api/label?callNumber=${encodeURIComponent(holding.callNumber)}&barcode=${encodeURIComponent(holding.barcode)}`">下载标签</a>
          </span>
        </template>
      </a-table>
    </template>
  </a-table>
</template>

<script>
import axios from 'axios';
import { defineComponent, reactive } from 'vue';


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
    title: '简介',
    dataIndex: 'summary',
    key: 'summary',
    ellipsis: true,
  },
];

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

export default defineComponent({
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
      getBookList,
      bookListState,
      listenRow,
    };
  },
});
</script>
