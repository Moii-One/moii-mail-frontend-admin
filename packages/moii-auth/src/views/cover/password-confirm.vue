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
                class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0"
            >
                <div
                    class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]"
                >
                    <div
                        class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"
                    ></div>
                    <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                        <router-link to="/" class="w-48 block lg:w-72 ms-10">
                            <img src="/assets/images/auth/logo-white.svg" alt="Logo" class="w-full" />
                        </router-link>
                        <div class="mt-24 hidden w-full max-w-[430px] lg:block">
                            <img src="/assets/images/auth/reset-password.svg" alt="Cover Image" class="w-full" />
                        </div>
                    </div>
                </div>
                <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                    <div class="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <router-link to="/" class="w-8 block lg:hidden">
                            <img src="/assets/images/logo.svg" alt="Logo" class="mx-auto w-10" />
                        </router-link>
                        <div class="dropdown ms-auto w-max">
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
                    <div class="w-full max-w-[440px] lg:mt-16">
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
                                <label for="Email">Email</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="Email" 
                                        v-model="form.email" 
                                        type="email" 
                                        placeholder="Enter Email" 
                                        class="form-input pl-10 placeholder:text-white-dark"
                                        required
                                        readonly
                                    />
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2">
                                        <icon-mail :fill="true" />
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label for="Password">New Password</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="Password" 
                                        v-model="form.password" 
                                        :type="showPassword ? 'text' : 'password'" 
                                        placeholder="Enter New Password" 
                                        class="form-input pl-10 placeholder:text-white-dark"
                                        required
                                    />
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2">
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
                                <label for="PasswordConfirmation">Confirm Password</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="PasswordConfirmation" 
                                        v-model="form.password_confirmation" 
                                        :type="showPasswordConfirmation ? 'text' : 'password'" 
                                        placeholder="Confirm New Password" 
                                        class="form-input pl-10 placeholder:text-white-dark"
                                        required
                                    />
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2">
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
                    <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}.VRISTO All Rights Reserved.</p>
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
import IconEye from "../../components/icon/icon-eye.vue";
import IconEyeOff from "../../components/icon/icon-eye-off.vue";
import IconCheck from "@/components/icon/icon-circle-check.vue";    useMeta({ title: 'Confirm Password Reset - Cover' });
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
