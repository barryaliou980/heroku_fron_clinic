import { boot } from 'quasar/wrappers'
import {LocalStorage} from 'quasar'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const storedLang = LocalStorage.getItem('anty-locale');


export const i18n = createI18n({
    locale: storedLang !== null ? `${storedLang}` : 'en',
    messages
  })

export default boot(({ app }) => {
  app.use(i18n)
})

