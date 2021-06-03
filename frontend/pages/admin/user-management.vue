<template>
  <div class="main-wrapper">
    <HeaderElement />

    <OffCanvasMobileMenu />

    <SearchPopup />

    <Breadcrumb :items="items" title="Admin User Management Table" />

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
          :items="users"
          responsive="sm"
        >
          <template #cell(index)="data">
            {{ startNumber + data.index + 1 }}
          </template>

          <template #cell(User_Name)="data">
            {{ data.item.username }}
          </template>

          <template #cell(Email)="data">
            {{ data.item.email }}
          </template>

          <template #cell(Created)="data">
            <Date
              :date="data.item.created_on"
              format="ISO"
              v-if="data.item.created_on"
            />
            <span v-else>-</span>
          </template>

          <template #cell(Last_Login)="data">
            <Date
              :date="data.item.last_login"
              format="dynamicDateTime"
              v-if="data.item.last_login"
            />
            <span v-else>-</span>
          </template>

          <template #cell(Email_Verify)="data">
            {{ data.item.email_verification }}
          </template>

          <template #cell(Role)="data">
            {{ data.item.role_name }}
          </template>

          <template #cell(Verify)="data">
            {{ data.item.verified }}
          </template>

          <template #cell(Actions)="data">
            <n-link :to="`/admin/edit-user/${data.item.user_id}`">
              <b-icon-pen font-size="20"></b-icon-pen>
            </n-link>
            <a href="#" @click="deleteUser(data.item.user_id)">
              <b-icon-trash font-size="20"></b-icon-trash>
            </a>
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
import { BTable, BIconTrash, BIconPen } from "bootstrap-vue";

export default {
  middleware: "auth",
  async asyncData({ store }) {
    const allUsers = await store.dispatch("users/FETCH_ALL_USERS");
    return { allUsers };
  },
  components: {
    HeaderElement: () => import("@/components/home/HeaderElement"),
    OffCanvasMobileMenu: () =>
      import("@/components/navigation/OffCanvasMobileMenu"),
    SearchPopup: () => import("@/components/home/SearchPopup"),
    Breadcrumb: () => import("@/components/Breadcrumb"),
    FooterTwo: () => import("@/components/home/FooterTwo"),
    Date: () => import("@/components/atoms/Date"),
    Pagination: () => import("@/components/atoms/Pagination"),
    BIconTrash,
    BIconPen,
    BTable,
  },
  watch: {
    allUsers() {
      this.updatePage();
    },
    countPerPage() {
      this.updatePage();
    },
  },
  data() {
    return {
      users: [],
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
          text: "Admin",
          to: "/admin",
        },
        {
          text: "Admin Management Table",
          active: true,
        },
      ],
      fields: [
        "index",
        "User_Name",
        "Email",
        "Created",
        "Last_Login",
        "Email_Verify",
        "Role",
        "Verify",
        "Actions",
      ],
    };
  },

  mounted() {
    document.body.classList.add("template-color-1", "template-font-1");
    this.updatePage();
  },

  methods: {
    deleteUser(id) {
      const user = this.allUsers.find((item) => item.user_id === id);

      this.$bvModal
        .msgBoxConfirm(`Are you sure to delete "${user.username}"?`, {
          title: "Please Confirm delete Item",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (value) {
            const res = await this.$store.dispatch("users/DELETE_USER", { id });

            if (res.success) {
              this.allUsers = res.data;
            } else {
              this.$router.push("/");
            }
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    removeDup(arr) {
      return [...new Set(arr)];
    },
    updatePagination() {
      const c = this.allUsers ? this.allUsers.length / this.countPerPage : 0;
      this.pageCount = c === Math.floor(c) ? c : Math.floor(c) + 1;
      this.showPagination = true;
    },
    goPage(pageNumber) {
      this.startNumber = (pageNumber - 1) * this.countPerPage;
      this.users = this.allUsers.slice(
        this.startNumber,
        this.startNumber + this.countPerPage
      );
    },
    updatePage() {
      this.users = this.allUsers
        ? this.allUsers.slice(0, this.countPerPage)
        : [];
      this.updatePagination();
    },
  },

  head() {
    return {
      title: "Admin User Managerment",
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