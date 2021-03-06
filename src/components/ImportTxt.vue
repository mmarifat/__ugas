<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 600px">
      <q-form greedy @submit.prevent="save">
        <q-linear-progress color="blue-grey-14" :value="1"/>
        <q-card-section class="text-bold text-h5 text-center">
          Import TXT
        </q-card-section>
        <q-card-section>
          <q-file :rules="[v=> !!v || 'Required!!']" label="Select File" v-model="file" accept=".txt"
                  :hint="'Total '+importInfo.length+' rows to import'"/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="red-14" @click="closeModal" outline label="Close"/>
          <q-btn color="primary" type="submit" label="Save & Import"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang='ts'>
import {Component, Vue, Watch} from "vue-property-decorator";
import {IImports} from "components/IImports";
import {Notify} from "quasar";

@Component
export default class ImportTxt extends Vue {
  show: boolean = false
  file: any = null
  importInfo: IImports[] = []
  importLength: number = 0

  created() {
    this.$root.$on('importTxt', () => {
      this.file = null
      this.importInfo = []
      this.importLength = 0
      this.show = true
    })
  }

  @Watch('file')
  analyze() {
    if (this.file) {
      new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsText(this.file);
        reader.onload = function (event: any) {
          let fileContent = event.target.result;
          const allLines: Array<string> = fileContent.split(/\r\n|\n/);

          let skip: Array<string> = ['|System', '|User', '|Program', '|Pers. Area ', '|Personnel Area/Sub Area Total', 'Payee Key :',
            '|Payee Key Total', '|Grand Total', '-------------------------------------------------------------']

          let importInfo: Array<IImports> = []

          for (const line of allLines) {
            if (!skip.some(s => line.includes(s)))
              importInfo.push({
                province: line.slice(1, 22).trim().split('-')[0],
                district: line.slice(1, 22).trim().split('-')[1],
                ministry: line.slice(22, 39).trim(),
                employeeNo: line.slice(39, 48).trim(),
                manNo: line.slice(48, 57).trim(),
                names: line.slice(57, 77).trim(),
                nrcNo: line.slice(77, 94).trim(),
                referenceNo: line.slice(94, 114).trim() || '',
                periodName: line.slice(114, 121).trim(),
                subTotal: Number(line.slice(121, 145).replace(',', '').trim()),
                total: Number(line.slice(145, 165).replace(',', '').trim()),
                empNo: line.slice(165, 172).trim(),
                recNo: line.slice(172, 178).trim(),
                importBy: 'admin',
                importAt: new Date().toISOString().split('T')[0]
              })
          }
          resolve(importInfo)
        }
      }).then((res: any) => {
        this.importInfo = res
        this.importLength = this.importInfo.length
      })
    }
  }

  save() {
    Notify.create({
      message: 'Importing total ' + this.importLength + ' data in the background..!!',
      caption: 'Please wait sometime to complete!!',
      type: 'positive'
    })
    this.$store.dispatch("setPeriodOptions", this.importInfo[0].periodName)
    this.$axios.post('/save/' + this.importInfo[0].periodName, this.importInfo).then(({data}) => {
      if (!data) {
        Notify.create({
          message: 'Already Imported!!',
          type: 'negative'
        })
      } else {
        Notify.create({
          message: 'Imported total ' + this.importLength + ' data!!',
          type: 'positive'
        })
      }
    })
    this.closeModal()
  }


  closeModal() {
    this.importInfo = []
    this.file = null
    this.show = false
  }
}
</script>

<style lang='scss'>

</style>
