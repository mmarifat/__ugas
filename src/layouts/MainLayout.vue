<template>
  <q-layout view="lHh LpR lFf">
    <q-header reveal :class="$q.dark.isActive ? 'header_dark' : 'header_normal'">
      <q-toolbar>
        <q-btn @click="left = !left" flat round dense icon="menu" class="q-mr-sm"/>

        <q-toolbar-title>UGAS System</q-toolbar-title>
        <q-btn class="q-mr-xs" flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'">
          <q-tooltip>
            Change Theme
          </q-tooltip>
        </q-btn>

        <q-btn no-caps label="Import Data" flat dense icon="add" class="q-mr-xs" @click="$root.$emit('importTxt')">
          <q-tooltip>
            Import TXT
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer class="left-navigation text-white" v-model="left" elevated show-if-above
              style="background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;" side="left">
      <div class="full-height" :class="$q.dark.isActive ? 'drawer_dark' : 'drawer_normal'">
        <div style="height: calc(100% - 117px);padding:10px;">
          <q-toolbar>
            <q-avatar>
              <q-img src="logo.png"/>
            </q-avatar>

            <q-toolbar-title>UGAS System</q-toolbar-title>
          </q-toolbar>
          <hr/>
          <q-scroll-area style="height:100%;">
            <q-list padding>
              <q-item active-class="tab-active" :to="{name:'schedule'}" exact class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="dashboard"/>
                </q-item-section>

                <q-item-section>
                  Schedule [RAW]
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  Schedule [RAW]
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" :to="{name:'newEmployees'}" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="star"/>
                </q-item-section>

                <q-item-section>
                  New Employees
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  New Employees
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" :to="{name:'newMembers'}" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="published_with_changes"/>
                </q-item-section>

                <q-item-section>
                  New Members
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  New Members
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" :to="{name:'missing'}" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="rule"/>
                </q-item-section>

                <q-item-section>
                  Missing Members
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  Missing Members
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" :to="{name:'transfers'}" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="transform"/>
                </q-item-section>

                <q-item-section>
                  Transfers
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  Transfers
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" :to="{name:'notYet'}" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="supervisor_account"/>
                </q-item-section>

                <q-item-section>
                  HR Management
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  HR Management
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" :to="{name:'notYet'}" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="credit_card"/>
                </q-item-section>

                <q-item-section>
                  Finance Management
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  Finance Management
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" :to="{name:'notYet'}" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="store"/>
                </q-item-section>

                <q-item-section>
                  Stock Management
                </q-item-section>

                <q-tooltip content-class="bg-primary">
                  Stock Management
                </q-tooltip>
              </q-item>

              <q-item active-class="tab-active" class="q-ma-sm navigation-item" clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="power_settings_new"/>
                </q-item-section>

                <q-item-section>
                  Logout
                </q-item-section>

                <q-popup-proxy :breakpoint="700">
                  <q-banner dense>
                    Sure to logout?
                    <template v-slot:action>
                      <q-btn color="negative" @click="logoutNotify" glossy v-close-popup>Yes</q-btn>
                      <q-btn color="secondary" glossy v-close-popup>No</q-btn>
                    </template>
                  </q-banner>
                </q-popup-proxy>

                <q-tooltip content-class="bg-primary">
                  Logout
                </q-tooltip>

              </q-item>

            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="full-height">
            <q-scroll-area class="col q-pr-sm full-height" visible>
              <router-view/>
            </q-scroll-area>
          </div>
        </div>
        <import-txt/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ImportTxt from "components/ImportTxt.vue";

@Component({
  components: {ImportTxt}
})
export default class MainLayout extends Vue {
  left: boolean = true;

  logoutNotify() {
    if (this.$route.name !== 'login') {
      this.$q.sessionStorage.clear()
      this.$router.push({name: 'login'})
      this.$q.notify({
        message: 'Successfully Logged out!!',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss">
.q-drawer {
  background-image: url("/lake.jpg") !important;
  background-size: cover !important;
}

.drawer_normal {
  background-color: rgba(1, 1, 1, 0.75);
}

.drawer_dark {
  background-color: #010101f2;
}

.navigation-item {
  border-radius: 5px;
}

.tab-active {
  background-color: green;
}

body {
  background: #f1f1f1 !important;
}

.header_normal {
  background: linear-gradient(
      145deg,
      rgb(32, 106, 80) 15%,
      rgb(21, 57, 102) 70%
  );
}

.header_dark {
  background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%);
}
</style>
