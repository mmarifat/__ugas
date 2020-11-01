<template>
  <q-page>
    <q-card flat class="row justify-center full-width q-pt-md q-pb-md">

      <q-card-section class="col col-12 col-md-4 text-center">
        <q-markup-table flat>
          <tbody>
          <tr>
            <td class="text-left">Current Period</td>
            <q-select v-model="period.current" :options="periodOptions.filter(f=> f !== period.previous)" hide-bottom-space/>
          </tr>
          <tr>
            <td class="text-left">Current Period Total</td>
            <td class="text-right">{{ Number(currentTotal).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-left">Current Period Count</td>
            <td class="text-right">{{ currentCount }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <q-space/>

      <q-card-section class="col col-12 col-md-4 text-center">
        <q-markup-table flat>
          <tbody>
          <tr>
            <td class="text-left">Previous Period</td>
            <q-select v-model="period.previous" :options="periodOptions.filter(f=> f !== period.current)" hide-bottom-space/>
          </tr>
          <tr>
            <td class="text-left">Previous Period Total</td>
            <td class="text-right">{{ Number(previousTotal).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-left">Previous Period Count</td>
            <td class="text-right">{{ previousCount }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <q-separator/>

    <q-table title="Transfers" :data="rows" :columns="columns" row-key="id" :pagination="pagination" wrap-cells
             :filter="filter" binary-state-sort card-class="full-width">

      <template v-slot:no-data="{ icon, filter }">
        <div class="full-width row flex-center text-dark text-h5">
          <q-icon color="dark" :name="filter ? 'filter_b_and_w' : icon" size="1.9rem"/>
          <span>No data to show!</span>
        </div>
      </template>

      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" label="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>

    </q-table>
  </q-page>
</template>

<script lang='ts'>
import {Component, Vue, Watch} from "vue-property-decorator";
import {Loading, QSpinnerBars} from "quasar";

@Component
export default class Transfers extends Vue {

  period: any = {current: '', previous: ''}
  currentTotal: number = 0;
  currentCount: number = 0;
  previousTotal: number = 0;
  previousCount: number = 0;

  periodOptions: string[] = []

  pagination: any = {
    sortBy: 'employeeNo',
    descending: true,
    page: 1,
    rowsPerPage: 50
  }
  filter: any = ''
  rows: any[] = []
  columns: any[] = [
    {
      label: 'EmployeeNo',
      field: 'employeeNo',
      name: 'employeeNo',
      sortable: true
    },
    {
      label: 'ManNo',
      field: 'manNo',
      name: 'manNo',
      sortable: true
    },
    {
      label: 'NRC',
      field: 'nrc',
      name: 'nrc',
      sortable: true
    },
    {
      label: 'Names',
      field: 'names',
      name: 'names',
      sortable: true
    },
    {
      label: 'NewEmployer',
      field: 'newEmployer',
      name: 'newEmployer',
      sortable: true
    },
    {
      label: 'NewProvince',
      field: 'newProvince',
      name: 'newProvince',
      sortable: true
    },
    {
      label: 'NewDistrict',
      field: 'newDistrict',
      name: 'newDistrict',
      sortable: true
    },
    {
      label: 'PrevEmployer',
      field: 'prevEmployer',
      name: 'prevEmployer',
      sortable: true
    },
    {
      label: 'PrevProvince',
      field: 'prevProvince',
      name: 'prevProvince',
      sortable: true
    },
    {
      label: 'PrevDistrict',
      field: 'prevDistrict',
      name: 'prevDistrict',
      sortable: true
    }
  ]

  created() {
    this.$axios.get('periods').then(({data}) => {
      this.periodOptions = data.map((m: any) => m.periodName).sort().reverse()
    })
  }

  @Watch('period', {immediate: true, deep: true})
  async onPeriodChange() {
    if (this.period.current && this.period.previous) {
      Loading.show({
        //@ts-ignore
        spinner: QSpinnerBars,
        spinnerColor: 'yellow',
        message: 'Getting transfers from server............',
        messageColor: 'yellow'
      })
      await Promise.all([
        this.$axios.get('essentials/' + this.period.current + '/' + this.period.previous).then(({data}) => data),
        this.$axios.patch('transfers/' + this.period.current + '/' + this.period.previous).then(({data}) => data)
      ]).then(([essentials, transfers]) => {

        this.currentCount = essentials.currentCount
        this.previousCount = essentials.previousCount
        this.currentTotal = essentials.currentTotal[0].total
        this.previousTotal = essentials.previousTotal[0].total

        this.rows = transfers

      }).finally(() => {
        Loading.hide()
      })
    }
  }
}
</script>

<style lang='scss'>

</style>
