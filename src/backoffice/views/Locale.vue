<template>
            <!-- <div id="locale" class="locale"> -->
                <ion-select interface="popover"
                @ionChange="changeLanguage($event.target.value)" :value="currentLanguaje">
                    <ion-select-option v-for="language in languages" :key="language.locale" :value="language.locale" >{{language.locale}}</ion-select-option>
                </ion-select>
            <!-- </div> -->

</template>

<script>
import { i18n } from '@/plugins/i18n'

export default{
    name: 'LanguageComponent',
    data: () => ({
        currentLanguaje: i18n.locale,
    }),
    computed: {
        languages() {
            return [
                { locale: 'es', title: this.$t('spanish') },
                { locale: 'en', title: this.$t('english') }
            ]
        }
    },
    methods: {
        changeLanguage(locale) {
            this.currentLanguaje = locale
            i18n.locale = locale
        }
    }
}
</script>