<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
        </div>

        <div
            class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"
        >
            <img src="/assets/images/auth/coming-soon-object1.png" alt="image" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
            <img src="/assets/images/auth/coming-soon-object2.png" alt="image" class="absolute left-24 top-0 h-40 md:left-[30%]" />
            <img src="/assets/images/auth/coming-soon-object3.png" alt="image" class="absolute right-0 top-0 h-[300px]" />
            <img src="/assets/images/auth/polygon-object.svg" alt="image" class="absolute bottom-0 end-[28%]" />
            <div
                class="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]"
            >
                <div class="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                    <div class="absolute top-6 end-6">
                        <div class="dropdown">
                            <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="8">
                                <button
                                    type="button"
                                    class="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                >
                                    <div>
                                        <img :src="currentFlag" alt="image" class="h-5 w-5 rounded-full object-cover" />
                                    </div>
                                    <div class="text-base font-bold uppercase">{{ store.locale }}</div>
                                    <span class="shrink-0">
                                        <icon-caret-down />
                                    </span>
                                </button>
                                <template #content="{ close }">
                                    <ul class="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                        <template v-for="item in store.languageList" :key="item.code">
                                            <li>
                                                <button
                                                    type="button"
                                                    class="w-full hover:text-primary"
                                                    :class="{ 'bg-primary/10 text-primary': i18n.locale === item.code }"
                                                    @click="changeLanguage(item), close()"
                                                >
                                                    <img
                                                        class="w-5 h-5 object-cover rounded-full"
                                                        :src="`/assets/images/flags/${item.code.toUpperCase()}.svg`"
                                                        alt=""
                                                    />
                                                    <span class="ltr:ml-3 rtl:mr-3">{{ item.name }}</span>
                                                </button>
                                            </li>
                                        </template>
                                    </ul>
                                </template>
                            </Popper>
                        </div>
                    </div>
                    <div class="mx-auto w-full max-w-[440px]">
                        <div class="mb-10">
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Two-Factor Authentication</h1>
                            <p class="text-base font-bold leading-normal text-white-dark">Enter the code sent to your email or phone</p>
                        </div>
                        <form class="space-y-5 dark:text-white" @submit.prevent="handleVerify2FA">
                            <div>
                                <label for="Code">2FA Code</label>
                                <div class="relative text-white-dark">
                                    <input id="Code" v-model="form.code" type="text" placeholder="Enter 2FA Code" class="form-input ps-10 placeholder:text-white-dark" maxlength="8" />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                            </div>
                            <div v-if="authStore.error" class="text-red-500 text-sm">
                                {{ authStore.error }}
                            </div>
                            <button type="submit" :disabled="authStore.isLoading || !form.code || form.code.length !== 8" class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                {{ authStore.isLoading ? 'Verifying...' : 'Verify' }}
                            </button>
                        </form>
                        <div class="text-center dark:text-white mt-6">
                            Didn't receive the code?
                            <a href="javascript:" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                Resend Code
                            </a>
                        </div>
                        <div class="text-center dark:text-white mt-4">
                            <router-link 
                                to="/login" 
                                class="text-primary hover:text-black dark:hover:text-white underline transition"
                            >
                                ← Back to Login
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { computed, reactive, ref, onMounted } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { toggleLanguage } from '@/config';
    import { useAppStore } from '../../stores/index';
    import { useRouter, useRoute } from 'vue-router';
    import { useMeta } from '../../composables/use-meta';
    import { useAuthStore } from '../../stores/auth';

    import IconCaretDown from '../../components/icon/icon-caret-down.vue';
    import IconLockDots from '../../components/icon/icon-lock-dots.vue';

    useMeta({ title: '2FA Verification' });
    const router = useRouter();
    const route = useRoute();
    const store = useAppStore();
    const authStore = useAuthStore();

    // Form data
    const form = reactive({
        code: '',
    });

    // Get verification UUID from route query
    const verificationUuid = ref('');

    onMounted(() => {
        verificationUuid.value = route.query.verification_uuid as string;
        const codeFromUrl = route.query.code as string;
        
        if (!verificationUuid.value) {
            // If no verification UUID, redirect to login
            router.push('/login');
            return;
        }
        
        // If code is provided in URL (from email click), auto-fill and verify
        if (codeFromUrl) {
            form.code = codeFromUrl;
            // Auto-verify if code is provided
            handleVerify2FA();
        }
    });

    const handleVerify2FA = async () => {
        if (!verificationUuid.value || !form.code) return;
        
        const result = await authStore.verify2FA(verificationUuid.value, form.code);
        if (result.success) {
            // Clear any errors and redirect to intended page or dashboard
            authStore.clearError();
            const redirectTo = route.query.redirect as string || '/';
            router.push(redirectTo);
        }
    };

    // multi language
    const i18n = reactive(useI18n());
    const changeLanguage = (item: any) => {
        i18n.locale = item.code;
        toggleLanguage(item);
    };
    const currentFlag = computed(() => {
        return `/assets/images/flags/${i18n.locale.toUpperCase()}.svg`;
    });
</script>
