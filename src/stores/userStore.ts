import { defineStore } from 'pinia';
import { User, UserStoreInitPayload } from '../components/models';

export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      isLogged: false,
      loggedUser: {} as User,
      users: [] as User[],
      token: null
    };
  },

  getters: {
    fullName: ({ loggedUser }) =>
      `${loggedUser.firstName} ${loggedUser.lastName}`,
      userToken(state) {
        return state.token;
   }
  },

  actions: {
    init(payload: UserStoreInitPayload) {
      this.users = payload.users;
    },
    logout() {
      this.isLogged = false;
      this.loggedUser = {} as User;
      this.users = [] as User[];
      this.token = null;
    },
  },
  persist: {
    paths: ['isLogged', 'loggedUser'],
  },
});
