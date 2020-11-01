import {store} from 'quasar/wrappers';
import Vuex from 'vuex';

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
}

export default store(function ({Vue}) {
  Vue.use(Vuex);

  return new Vuex.Store<StateInterface>({
    state: {
      periods: {current: '', previous: ''}
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
      Periods: (state) => state.periods
    }
  });
});
