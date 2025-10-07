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
                        <div class="mb-7">
                            <h1 class="mb-3 text-2xl font-bold !leading-snug dark:text-white">Set New Password</h1>
                            <p>Enter your new password to complete the reset process</p>
                        </div>
                        
                        <!-- Success Message -->
                        <div v-if="passwordReset" class="mb-6 p-4 bg-success/10 border border-success/20 rounded-md">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                                    <icon-check class="w-4 h-4 text-success" />
                                </div>
                                <div>
                                    <p class="text-success font-medium">Password reset successfully!</p>
                                    <p class="text-sm text-success/80">You can now login with your new password.</p>
                                </div>
                            </div>
                        </div>
                        
                        <form v-if="!passwordReset" class="space-y-5" @submit.prevent="submitForm">
                            <div>
                                <label for="Email" class="dark:text-white">Email</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="Email" 
                                        v-model="form.email" 
                                        type="email" 
                                        placeholder="Enter Email" 
                                        class="form-input ps-10 placeholder:text-white-dark"
                                        required
                                        readonly
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-mail :fill="true" />
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label for="Password" class="dark:text-white">New Password</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="Password" 
                                        v-model="form.password" 
                                        :type="showPassword ? 'text' : 'password'" 
                                        placeholder="Enter New Password" 
                                        class="form-input ps-10 placeholder:text-white-dark"
                                        required
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-white-dark hover:text-dark dark:hover:text-white-light"
                                    >
                                        <icon-eye v-if="showPassword" />
                                        <icon-eye-off v-else />
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label for="PasswordConfirmation" class="dark:text-white">Confirm Password</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="PasswordConfirmation" 
                                        v-model="form.password_confirmation" 
                                        :type="showPasswordConfirmation ? 'text' : 'password'" 
                                        placeholder="Confirm New Password" 
                                        class="form-input ps-10 placeholder:text-white-dark"
                                        required
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                    <button
                                        type="button"
                                        @click="showPasswordConfirmation = !showPasswordConfirmation"
                                        class="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-white-dark hover:text-dark dark:hover:text-white-light"
                                    >
                                        <icon-eye v-if="showPasswordConfirmation" />
                                        <icon-eye-off v-else />
                                    </button>
                                </div>
                            </div>
                            
                            <div v-if="authStore.error" class="text-red-500 text-sm">
                                {{ authStore.error }}
                            </div>
                            
                            <button 
                                type="submit" 
                                :disabled="authStore.isLoading || !form.password || !form.password_confirmation"
                                class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                                <span v-if="authStore.isLoading">Resetting...</span>
                                <span v-else>Reset Password</span>
                            </button>
                        </form>
                        
                        <div class="text-center mt-6">
                            <router-link to="/login" class="text-primary underline hover:text-black dark:hover:text-white">
                                Back to Login
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
    import IconMail from '../../components/icon/icon-mail.vue';
    import IconLockDots from '../../components/icon/icon-lock-dots.vue';
    import IconEye from '../../components/icon/icon-eye.vue';
    import IconEyeOff from '../../components/icon/icon-eye-off.vue';
    import IconCheck from '@/components/icon/icon-circle-check.vue';

    useMeta({ title: 'Confirm Password Reset - Boxed' });
    const router = useRouter();
    const route = useRoute();
    const store = useAppStore();
    const authStore = useAuthStore();
    
    const passwordReset = ref(false);
    const showPassword = ref(false);
    const showPasswordConfirmation = ref(false);
    
    const form = reactive({
        email: '',
        password: '',
        password_confirmation: '',
        token: '',
    });
    
    onMounted(() => {
        // Get token and email from URL query parameters
        form.token = route.query.token as string || '';
        form.email = route.query.email as string || '';
        
        if (!form.token || !form.email) {
            // Redirect to password reset if missing parameters
            router.push('/password-reset');
        }
    });
    
    const submitForm = async () => {
        if (form.password !== form.password_confirmation) {
            authStore.error = 'Passwords do not match';
            return;
        }
        
        try {
            const result = await authStore.resetPassword(form.token, form.email, form.password, form.password_confirmation);
            if (result.success) {
                passwordReset.value = true;
                // Redirect to login after delay
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
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
