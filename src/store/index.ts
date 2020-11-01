import {store} from 'quasar/wrappers';
import Vuex from 'vuex';
import {Axios} from "boot/axios";

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  periods: { current: string, previous: string };
  periodOptions: string[]
}

export default store(async function ({Vue}) {
  Vue.use(Vuex);

  return new Vuex.Store<StateInterface>({
    state: {
      periods: {current: '', previous: ''},
      periodOptions: await Axios.get('periods').then(({data}) => data.length ? data.map((m: any) => m.periodName).sort().reverse() : []) as any
    },
    mutations: {
      setPeriods(state, imp: { current: string, previous: string }) {
        state.periods = imp
      }
    },
    actions: {
      setPeriods(state, imp: { current: string, previous: string }) {
        state.commit('setPeriods', imp)
      }
    },
    getters: {
      Periods: (state) => state.periods,
      PeriodOptions: (state) => state.periodOptions
    }
  });
});
