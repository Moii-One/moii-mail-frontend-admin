<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="$emit('close')" class="relative z-[51]">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-xl text-black dark:text-white-dark">
                            <button
                                type="button"
                                class="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                @click="$emit('close')"
                            >
                                <icon-x />
                            </button>
                            <div class="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                {{ isCreate ? 'Create New User' : 'Edit User' }}
                            </div>
                            <div class="p-5">
                                <form @submit.prevent="handleSubmit">
                                    <!-- Basic Information Section -->
                                    <div class="mb-6">
                                        <h6 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Basic Information</h6>
                                        
                                        <div class="grid grid-cols-2 gap-4 mb-5">
                                            <div>
                                                <label for="first_name">First Name *</label>
                                                <input
                                                    id="first_name"
                                                    v-model="form.first_name"
                                                    type="text"
                                                    required
                                                    placeholder="Enter first name"
                                                    class="form-input"
                                                />
                                            </div>
                                            <div>
                                                <label for="last_name">Last Name *</label>
                                                <input
                                                    id="last_name"
                                                    v-model="form.last_name"
                                                    type="text"
                                                    required
                                                    placeholder="Enter last name"
                                                    class="form-input"
                                                />
                                            </div>
                                        </div>

                                        <div class="mb-5">
                                            <label for="email">Email Address *</label>
                                            <input
                                                id="email"
                                                v-model="form.email"
                                                type="email"
                                                required
                                                placeholder="Enter email address"
                                                class="form-input"
                                                :disabled="!isCreate"
                                            />
                                        </div>

                                        <div v-if="isCreate" class="grid grid-cols-2 gap-4 mb-5">
                                            <div>
                                                <label for="password">Password *</label>
                                                <input
                                                    id="password"
                                                    v-model="form.password"
                                                    type="password"
                                                    :required="isCreate"
                                                    placeholder="Enter password (min 8 characters)"
                                                    class="form-input"
                                                />
                                            </div>
                                            <div>
                                                <label for="password_confirmation">Confirm Password *</label>
                                                <input
                                                    id="password_confirmation"
                                                    v-model="form.password_confirmation"
                                                    type="password"
                                                    :required="isCreate"
                                                    placeholder="Confirm password"
                                                    class="form-input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Contact Information Section -->
                                    <div class="mb-6">
                                        <h6 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Contact Information</h6>
                                        
                                        <div class="grid grid-cols-2 gap-4 mb-5">
                                            <div>
                                                <label for="phone">Phone Number</label>
                                                <input
                                                    id="phone"
                                                    v-model="form.phone"
                                                    type="tel"
                                                    placeholder="Enter phone number"
                                                    class="form-input"
                                                />
                                            </div>
                                            <div>
                                                <label for="company">Company</label>
                                                <input
                                                    id="company"
                                                    v-model="form.company"
                                                    type="text"
                                                    placeholder="Enter company name"
                                                    class="form-input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Address Information Section -->
                                    <div class="mb-6">
                                        <h6 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Address Information</h6>
                                        
                                        <div class="mb-5">
                                            <label for="street_address">Street Address</label>
                                            <input
                                                id="street_address"
                                                v-model="form.street_address"
                                                type="text"
                                                placeholder="Enter street address"
                                                class="form-input"
                                            />
                                        </div>

                                        <div class="grid grid-cols-2 gap-4 mb-5">
                                            <div>
                                                <label for="city">City</label>
                                                <input
                                                    id="city"
                                                    v-model="form.city"
                                                    type="text"
                                                    placeholder="Enter city"
                                                    class="form-input"
                                                />
                                            </div>
                                            <div>
                                                <label for="zip_code">Zip Code</label>
                                                <input
                                                    id="zip_code"
                                                    v-model="form.zip_code"
                                                    type="text"
                                                    placeholder="Enter zip code"
                                                    class="form-input"
                                                />
                                            </div>
                                        </div>

                                        <div class="mb-5">
                                            <label for="country">Country</label>
                                            <div class="country-select-wrapper">
                                                <Multiselect
                                                    v-model="selectedCountry"
                                                    :options="countries"
                                                    class="custom-multiselect"
                                                    :searchable="true"
                                                    placeholder="Select Country"
                                                    selected-label=""
                                                    select-label=""
                                                    deselect-label=""
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Account Settings Section (Edit Mode Only) -->
                                    <div v-if="!isCreate" class="mb-6">
                                        <h6 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Account Settings</h6>
                                        
                                        <div class="mb-5">
                                            <label for="status">Account Status</label>
                                            <select id="status" v-model="form.status" class="form-select">
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="flex justify-end items-center mt-8">
                                        <button type="button" class="btn btn-outline-danger" @click="$emit('close')">Cancel</button>
                                        <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4" :disabled="loading">
                                            {{ isCreate ? 'Create User' : 'Update User' }}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';
import { useUsersStore, type User, type CreateUserData, type UpdateUserData } from '../stores/users';
import IconX from '../components/icon/icon-x.vue';
import Multiselect from '@suadelabs/vue3-multiselect';
import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
import config from '../../config.json';

interface Props {
    user: User | null;
    isCreate: boolean;
}

interface Emits {
    (e: 'close'): void;
    (e: 'save', data: CreateUserData | UpdateUserData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const usersStore = useUsersStore();
const API_URL = config.api_url;

const loading = ref(false);
const show = computed(() => true);
const countries = ref<string[]>([]);
const selectedCountry = ref<string>('');
const countryCodeMap = ref<Record<string, string>>({}); // Maps country name to code

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    company: '',
    phone: '',
    street_address: '',
    city: '',
    zip_code: '',
    country: '',
    status: 'active' as 'active' | 'inactive' | 'suspended'
});

// Fetch countries from backend
onMounted(async () => {
    try {
        const response = await fetch(`${API_URL}/countries`);
        if (response.ok) {
            const data = await response.json();
            // Convert countries object to array of country names and create mapping
            if (data.countries) {
                countries.value = Object.values(data.countries);
                countryCodeMap.value = data.countries; // { "US": "United States", ... }
            }
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
    }

    // More aggressive autocomplete disabling
    const disableAutocomplete = () => {
        const multiselectInputs = document.querySelectorAll('.multiselect__input, .country-select-wrapper input');
        multiselectInputs.forEach(input => {
            input.setAttribute('autocomplete', 'new-password'); // This tricks browsers
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('spellcheck', 'false');
            input.setAttribute('name', 'country-' + Math.random()); // Random name to prevent autofill
        });
    };

    // Run immediately and on interval
    setTimeout(disableAutocomplete, 50);
    setTimeout(disableAutocomplete, 200);
    setTimeout(disableAutocomplete, 500);
    
    // Watch for DOM changes
    const observer = new MutationObserver(disableAutocomplete);
    const wrapper = document.querySelector('.country-select-wrapper');
    if (wrapper) {
        observer.observe(wrapper, { childList: true, subtree: true });
    }
});

// Watch selectedCountry to sync with form.country
watch(selectedCountry, (newCountry) => {
    // Keep form.country as the country name for display purposes
    form.value.country = newCountry || '';
});

// Watch for user prop changes to populate form
watch([() => props.user, countryCodeMap], ([newUser]) => {
    if (newUser) {
        // Split name into first and last
        const nameParts = newUser.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const userAny = newUser as any;
        form.value = {
            first_name: firstName,
            last_name: lastName,
            email: newUser.email,
            password: '',
            password_confirmation: '',
            company: newUser.company || '',
            phone: newUser.phone || '',
            street_address: userAny.street_address || '',
            city: userAny.city || '',
            zip_code: userAny.zip_code || '',
            country: userAny.country || '',
            status: newUser.status
        };
        
        // Set selected country - convert code to name if available
        if (userAny.country && Object.keys(countryCodeMap.value).length > 0) {
            selectedCountry.value = countryCodeMap.value[userAny.country] || userAny.country;
        } else if (userAny.country) {
            // If countries not loaded yet, store the code and it will be mapped when countries load
            selectedCountry.value = userAny.country;
        } else {
            selectedCountry.value = '';
        }
    } else {
        // Reset form for create mode
        form.value = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            company: '',
            phone: '',
            street_address: '',
            city: '',
            zip_code: '',
            country: '',
            status: 'active'
        };
        selectedCountry.value = '';
    }
}, { immediate: true });

const handleSubmit = async () => {
    loading.value = true;

    try {
        // Convert selected country name to code
        const countryCode = Object.keys(countryCodeMap.value).find(
            code => countryCodeMap.value[code] === selectedCountry.value
        ) || selectedCountry.value;

        if (props.isCreate) {
            // Validate passwords match
            if (form.value.password !== form.value.password_confirmation) {
                throw new Error('Passwords do not match');
            }

            const createData: any = {
                first_name: form.value.first_name,
                last_name: form.value.last_name,
                email: form.value.email,
                password: form.value.password,
                password_confirmation: form.value.password_confirmation,
                company: form.value.company || undefined,
                phone: form.value.phone || undefined,
                street_address: form.value.street_address || undefined,
                city: form.value.city || undefined,
                zip_code: form.value.zip_code || undefined,
                country: countryCode || undefined,
            };

            emit('save', createData);
        } else {
            const updateData: any = {
                first_name: form.value.first_name,
                last_name: form.value.last_name,
                email: form.value.email,
                company: form.value.company || undefined,
                phone: form.value.phone || undefined,
                street_address: form.value.street_address || undefined,
                city: form.value.city || undefined,
                zip_code: form.value.zip_code || undefined,
                country: countryCode || undefined,
                status: form.value.status
            };

            emit('save', updateData);
        }
    } catch (error) {
        console.error('Form validation error:', error);
        // You might want to show an error message here
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
:deep(.multiselect) {
    min-height: 42px;
}

:deep(.multiselect__tags) {
    min-height: 42px;
    padding: 8px 40px 0 8px;
    border: 1px solid #e0e6ed;
    border-radius: 6px;
    background: #fff;
}

:deep(.dark .multiselect__tags) {
    border-color: #191e3a;
    background: #1b2e4b;
}

:deep(.multiselect__input) {
    font-size: 14px;
    margin-bottom: 4px;
    padding-top: 0;
}

:deep(.multiselect__input::placeholder) {
    color: #888ea8;
}

:deep(.multiselect__single) {
    font-size: 14px;
    margin-bottom: 4px;
    padding-top: 0;
    background: transparent;
    color: inherit;
    display: block;
}

:deep(.multiselect__placeholder) {
    color: #888ea8;
    margin-bottom: 4px;
    padding-top: 0;
}

:deep(.multiselect__select) {
    height: 42px;
    width: 40px;
}

:deep(.multiselect__content-wrapper) {
    border: 1px solid #e0e6ed;
    border-radius: 6px;
    max-height: 200px;
}

:deep(.dark .multiselect__content-wrapper) {
    border-color: #191e3a;
    background: #1b2e4b;
}

:deep(.multiselect__option) {
    padding: 12px;
    font-size: 14px;
}

:deep(.multiselect__option--highlight) {
    background: #4361ee;
    color: #fff;
}

:deep(.multiselect__option--selected) {
    background: #f1f2f3;
    color: #4361ee;
    font-weight: 600;
}

:deep(.dark .multiselect__option--selected) {
    background: #191e3a;
}
</style>
