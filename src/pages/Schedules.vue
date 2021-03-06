<template>
  <q-page>
    <q-card flat class="row justify-center full-width q-pt-md q-pb-md">

      <q-card-section class="col col-12 col-md-4 text-center">
        <q-markup-table flat>
          <tbody>
          <tr>
            <td class="text-left">Current Period</td>
            <q-select v-model="period.current" :options="$store.getters.PeriodOptions.filter(f=> f !== period.previous)" hide-bottom-space/>
          </tr>
          <tr>
            <td class="text-left">Current Period Total</td>
            <td class="text-right">ZMW {{ Number(currentTotal).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-left">Current Period Count</td>
            <td class="text-right">{{ currentCount }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-section class="col col-12 col-md-4 text-center order-sm-last order-xs-last">
        <q-markup-table flat separator="none">
          <tbody>
          <tr>
            <td class="text-left"></td>
            <td class="text-right"></td>
          </tr>
          <tr>
            <td class="text-left">Difference [Total]</td>
            <td class="text-right">ZMW {{ (Number(currentTotal) - Number(previousTotal)).toFixed(2) }}</td>
          </tr>
          <tr>
            <td class="text-left">Difference Count [Total]</td>
            <td class="text-right">{{ (Number(currentCount) - Number(previousCount)) }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-section class="col col-12 col-md-4 text-center">
        <q-markup-table flat>
          <tbody>
          <tr>
            <td class="text-left">Previous Period</td>
            <q-select v-model="period.previous" :options="$store.getters.PeriodOptions.filter(f=> f !== period.current)" hide-bottom-space/>
          </tr>
          <tr>
            <td class="text-left">Previous Period Total</td>
            <td class="text-right">ZMW {{ Number(previousTotal).toFixed(2) }}</td>
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

    <q-table title="Schedule [RAW]" :data="rows" :columns="columns" row-key="id" :pagination="pagination" wrap-cells
             :filter="filter" binary-state-sort card-class="full-width" selection="multiple" :selected.sync="selected">

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
        <q-separator vertical size="10px" color="white"/>
        <div class="q-table__control q-py-sm">
          <q-btn color="purple-8" :disable="selected.length <= 0" @click="exportTable()" icon="save_alt" size="sm" push>
            <q-tooltip>
              Export
            </q-tooltip>
          </q-btn>
        </div>
      </template>

    </q-table>
  </q-page>
</template>

<script lang='ts'>
import {Component, Vue, Watch} from "vue-property-decorator";
import {capitilizeFirstLetter, convertDate, EImports} from "components/IImports";
import {exportFile, Loading, QSpinnerBars} from "quasar";
import * as XLSX from "xlsx";

@Component
export default class Schedules extends Vue {

  period: any = {current: '', previous: ''}
  currentTotal: number = 0;
  currentCount: number = 0;
  previousTotal: number = 0;
  previousCount: number = 0;

  selected: any[] = []

  pagination: any = {
    sortBy: 'employeeNo',
    descending: true,
    page: 1,
    rowsPerPage: 50
  }
  filter: any = ''
  rows: any[] = []
  columns: any = Object.keys(EImports).map(e => {
    return {
      label: e === 'employeeNo' ? 'Employee No' : e === 'manNo' ? 'Man No' : e === 'referenceNo' ? 'Reference No' : e === 'periodName' ? 'Period' :
        e === 'nrcNo' ? 'NRC' : capitilizeFirstLetter(e),
      name: e,
      field: e,
      sortable: true
    }
  })

  created() {
    if (this.$store.getters.Periods.current && this.$store.getters.Periods.previous) {
      this.period = this.$store.getters.Periods
    }
  }

  @Watch('period', {immediate: true, deep: true})
  onPeriodChange() {
    if (this.period.current && this.period.previous) {
      this.$store.dispatch("setPeriods", this.period)
      this.load()
    }
  }

  async load() {
    Loading.show({
      //@ts-ignore
      spinner: QSpinnerBars,
      spinnerColor: 'yellow',
      message: 'Getting Raw Data from server............',
      messageColor: 'yellow'
    })
    await Promise.all([
      this.$axios.get('essentials/' + this.period.current + '/' + this.period.previous).then(({data}) => data),
      this.$axios.patch('current/' + this.period.current).then(({data}) => data)
    ]).then(([essentials, cur]) => {
      if (essentials) {
        this.currentCount = essentials.currentCount
        this.previousCount = essentials.previousCount
        this.currentTotal = essentials.currentTotal[0].total
        this.previousTotal = essentials.previousTotal[0].total
      }
      if (cur.length) {
        this.rows = cur
      } else this.rows = []

    }).finally(() => {
      Loading.hide()
    })
  }

  exportTable() {
    let rowsToExport = this.selected.map((value: any) => {
      let row: any = {}
      Object.keys(value).filter(e => !['id'].includes(e)).forEach(field => {
        if (['importAt', 'updatedAt'].includes(field))
          row[capitilizeFirstLetter(field)] = value[field] ? convertDate(value[field]) : ''
        else
          row[capitilizeFirstLetter(field)] = value[field]
      })
      return row
    })
    let wb = XLSX.utils.book_new()
    let ws = XLSX.utils.json_to_sheet(rowsToExport)
    XLSX.utils.book_append_sheet(wb, ws, 'invoices')
    let wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'})
    exportFile('Schedules-' + convertDate(new Date(), null, false) + '.xlsx',
      wbout, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    this.selected = []
  }
}
</script>

<style lang='scss'>

</style>
