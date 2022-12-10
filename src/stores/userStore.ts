import { defineStore } from 'pinia';
import { User, UserStoreInitPayload } from '../components/models';

export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      isLogged: false,
      loggedUser: {} as User,
      users: [] as User[],
    };
  },

  getters: {
    fullName: ({ loggedUser }) =>
      `${loggedUser.firstName} ${loggedUser.lastName}`,
  },

  actions: {
    init(payload: UserStoreInitPayload) {
      this.users = payload.users;
    },
    logout() {
      this.isLogged = false;
      this.loggedUser = {} as User;
      this.users = [] as User[];
    },
  },
  persist: {
    paths: ['isLogged', 'loggedUser'],
  },
});
