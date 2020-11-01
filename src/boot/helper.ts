import {boot} from "quasar/wrappers";
import {Route} from "vue-router/types/router";
import {Loading, Notify, QSpinnerBars, SessionStorage} from "quasar";


export default boot<any>(({Vue, router, store, app}: any) => {
  router.beforeEach((to: Route, from: Route, next: any) => {
    document.title = to.meta.title(to) ? to.meta.title(to) + " :: UGAS System" : 'UGAS System'
    //@ts-ignore
    Loading.show({spinner: QSpinnerBars, spinnerSize: '75px'});
    if ((SessionStorage.getItem('login') as any)) {
      if (to.name === 'login') {
        router.replace({name: 'dashboard'});
      }
    } else {
      if (to.name !== 'login') {
        router.replace({name: 'login'});
        Notify.create({
          type: 'negative',
          message: 'Access protected!',
          caption: '403 Access Denied!'
        })
      }
    }
    next()
  });

  router.afterEach(() => {
    Loading.hide();
  })
})
