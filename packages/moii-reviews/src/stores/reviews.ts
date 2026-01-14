import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../moii-auth/src/stores/auth';
import { getAuthHeaders as sharedGetAuthHeaders } from '../../../moii-auth/src/utils/http';
import config from '../../config.json';

export interface Review {
    id: number;
    uuid: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    reviewable: {
        type: string;
        id: number;
        name: string;
    } | null;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface CreateReviewData {
    rating: number;
    comment: string;
    reviewable_type: string;
    reviewable_id: number;
}

export interface UpdateReviewData {
    rating?: number;
    comment?: string;
    status?: 'pending' | 'approved' | 'rejected';
}

export interface ReviewsResponse {
    success: boolean;
    message: string;
    message_code: string;
    reviews?: Review[];
    review?: Review;
    pagination?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export const useReviewsStore = defineStore('reviews', () => {
    const authStore = useAuthStore();
    const API_URL = config.api_url;

    // State
    const reviews = ref<Review[]>([]);
    const currentReview = ref<Review | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref({
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1
    });

    // Getters
    const pendingReviews = computed(() =>
        reviews.value.filter(review => review.status === 'pending')
    );

    const approvedReviews = computed(() =>
        reviews.value.filter(review => review.status === 'approved')
    );

    const rejectedReviews = computed(() =>
        reviews.value.filter(review => review.status === 'rejected')
    );

    const totalReviews = computed(() =>
        pagination.value.total
    );

    const getReviewById = (id: number) => {
        return reviews.value.find(review => review.id === id);
    };

    const getReviewByUuid = (uuid: string) => {
        return reviews.value.find(review => review.uuid === uuid);
    };

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const shared = sharedGetAuthHeaders();
        if (shared['Authorization']) headers['Authorization'] = shared['Authorization'];

        return headers;
    };

    // Actions
    async function fetchReviews(filters: {
        search?: string;
        status?: string;
        rating?: string;
        page?: number;
        per_page?: number;
    } = {}) {
        loading.value = true;
        error.value = null;
        try {
            const queryParams = new URLSearchParams();
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.rating) queryParams.append('rating', filters.rating);
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.per_page) queryParams.append('per_page', filters.per_page.toString());

            const response = await fetch(`${API_URL}?${queryParams}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: ReviewsResponse = await response.json();
            reviews.value = data.reviews || [];
            if (data.pagination) {
                pagination.value = data.pagination;
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching reviews:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchPendingReviews() {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/pending`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: ReviewsResponse = await response.json();
            reviews.value = data.reviews || [];
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching pending reviews:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function createReview(reviewData: CreateReviewData) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: ReviewsResponse = await response.json();
            // Refresh reviews list after creation
            await fetchReviews();
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error creating review:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateReview(uuid: string, reviewData: UpdateReviewData) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: ReviewsResponse = await response.json();
            // Update review in local state
            const index = reviews.value.findIndex(review => review.uuid === uuid);
            if (index !== -1 && data.review) {
                reviews.value[index] = { ...reviews.value[index], ...data.review };
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating review:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function approveReview(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${uuid}/approve`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Update review status in local state
            const review = reviews.value.find(r => r.uuid === uuid);
            if (review) {
                review.status = 'approved';
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error approving review:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function rejectReview(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${uuid}/reject`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Update review status in local state
            const review = reviews.value.find(r => r.uuid === uuid);
            if (review) {
                review.status = 'rejected';
            }
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error rejecting review:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteReview(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Remove review from local state
            reviews.value = reviews.value.filter(review => review.uuid !== uuid);
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting review:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchReviewByUuid(uuid: string) {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(`${API_URL}/${uuid}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.message_code || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use the default message
                }
                throw new Error(errorMessage);
            }

            const data: ReviewsResponse = await response.json();
            currentReview.value = data.review || null;
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching review:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        // State
        reviews,
        currentReview,
        loading,
        error,
        pagination,

        // Getters
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        totalReviews,
        getReviewById,
        getReviewByUuid,

        // Actions
        fetchReviews,
        fetchPendingReviews,
        createReview,
        updateReview,
        approveReview,
        rejectReview,
        deleteReview,
        fetchReviewByUuid,
    };
});
