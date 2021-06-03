<template>
  <div class="main-wrapper">
    <HeaderElement />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <Breadcrumb :items="items" title="Admin Blog Table" />

    <div
      class="bk-blog-grid-area pt--100 pb--100 pt_md--80 pb_md--80 pb_sm--80 pt_sm--60"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-1 mb-1">
            <b-form-select
              v-model="countPerPage"
              :options="availableRows"
            ></b-form-select>
          </div>
        </div>
        <b-table
          striped
          bordered
          hover
          foot-clone
          head-variant="dark"
          :fields="fields"
          :items="blogs"
          responsive="sm"
        >
          <template #cell(index)="data">
            {{ startNumber + data.index + 1 }}
          </template>

          <template #cell(title)="data">
            <n-link :to="`/blog/${data.item.slug}`">
              {{ data.item.caption }}
            </n-link>
          </template>

          <template #cell(Language)="data">
            <n-link
              :to="`/blog/${data.item.linked_slug}`"
              v-if="data.item.linked_slug"
            >
              <b-icon-pencil-fill font-size="20"></b-icon-pencil-fill>
            </n-link>
            <n-link :to="`/blog/blog-update/${data.item.slug}?dup=true`" v-else>
              <b-icon-plus-square font-size="20"></b-icon-plus-square>
            </n-link>
          </template>

          <template #cell(Author)="data">
            {{ data.item.username }}
          </template>

          <template #cell(Categories)="data">
            <n-link
              :to="`/blog/category-tag/${elem}?type=category`"
              v-for="(elem, inx) in removeDup(data.item.category_name)"
              :key="inx"
            >
              {{ elem
              }}{{
                inx === removeDup(data.item.category_name).length - 1 ? "" : ","
              }}
            </n-link>
          </template>

          <template #cell(Tags)="data">
            <n-link
              :to="`/blog/category-tag/${elem}?type=tag`"
              v-for="(elem, inx) in removeDup(data.item.tag_name)"
              :key="inx"
            >
              {{ elem
              }}{{
                inx === removeDup(data.item.tag_name).length - 1 ? "" : ","
              }}
            </n-link>
          </template>

          <template #cell(Published)="data">
            {{ data.item.published }}
          </template>

          <template #cell(Updated)="data">
            <Date :date="data.item.updated_on" format="ISO" />
          </template>
        </b-table>

        <div class="row">
          <div class="col-lg-12">
            <div class="brook-pagination-wrapper text-center pt--80 pt_sm--50">
              <Pagination
                v-if="showPagination"
                @goPage="goPage"
                :page-count="pageCount"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterTwo />
  </div>
</template>

<script>
import { BTable, BIconPlusSquare, BIconPencilFill } from "bootstrap-vue";

export default {
  middleware: "auth",
  async asyncData({ store }) {
    const allBlogs = await store.dispatch("blogs/GET_ADMIN_BLOGS");
    return { allBlogs };
  },
  components: {
    HeaderElement: () => import("@/components/home/HeaderElement"),
    OffCanvasMobileMenu: () =>
      import("@/components/navigation/OffCanvasMobileMenu"),
    SearchPopup: () => import("@/components/home/SearchPopup"),
    Breadcrumb: () => import("@/components/Breadcrumb"),
    // BlogPostThree: () => import('@/components/blogs/BlogPostThree'),
    FooterTwo: () => import("@/components/home/FooterTwo"),
    Date: () => import("@/components/atoms/Date"),
    Pagination: () => import("@/components/atoms/Pagination"),
    BIconPlusSquare,
    BIconPencilFill,
  },

  data() {
    return {
      blogs: [],
      pageCount: 0,
      countPerPage: 5,
      startNumber: 0,
      availableRows: [5, 10, 15],

      showPagination: false,
      items: [
        {
          text: "Home",
          to: "/",
        },
        {
          text: "Blog",
          to: "/blog",
        },
        {
          text: "Admin Blog Table",
          active: true,
        },
      ],
      fields: [
        "index",
        "Title",
        "Language",
        "Author",
        "Categories",
        "Tags",
        "Published",
        "Updated",
      ],
    };
  },

  watch: {
    countPerPage() {
      this.blogs = this.allBlogs
        ? this.allBlogs.slice(0, this.countPerPage)
        : [];
      this.updatePagination();
    },
  },

  mounted() {
    document.body.classList.add("template-color-1", "template-font-1");
    this.blogs = this.allBlogs ? this.allBlogs.slice(0, this.countPerPage) : [];
    this.updatePagination();
  },

  methods: {
    removeDup(arr) {
      return [...new Set(arr)];
    },
    updatePagination() {
      const c = this.allBlogs ? this.allBlogs.length / this.countPerPage : 0;
      this.pageCount = c === Math.floor(c) ? c : Math.floor(c) + 1;
      this.showPagination = true;
    },
    goPage(pageNumber) {
      this.startNumber = (pageNumber - 1) * this.countPerPage;
      this.blogs = this.allBlogs.slice(
        this.startNumber,
        this.startNumber + this.countPerPage
      );
    },
  },

  head() {
    return {
      title: "Admin Blog List",
    };
  },
};
</script>
<style>
a,
a:visited {
  color: rgb(19, 17, 18);
}
a:hover {
  color: rgb(4, 130, 214);
}
.table th {
  text-align: center;
}
.table th,
.table td {
  vertical-align: middle;
}
</style>