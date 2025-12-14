import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuthHeaders as sharedGetAuthHeaders } from '../utils/http';

export const useAuthStore = defineStore('auth', () => {
  // State
  const isLoading = ref(false)
  const error = ref('')
  const user = ref<any>(null)
  const _storedToken = localStorage.getItem('token') || ''
  const token = ref(_storedToken === 'undefined' ? '' : _storedToken)

  // Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = ''

    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Check if 2FA is required
        if (data.requires_2fa) {
          return { 
            success: true, 
            requires_2fa: true, 
            verification_uuid: data.verification_uuid,
            expires_at: data.expires_at,
            expires_in_minutes: data.expires_in_minutes,
            data 
          }
        }
        
        // Normal login - store token (accept both `access_token` and `token` from API)
        const receivedToken = data.access_token ?? data.token ?? ''
        token.value = receivedToken
        localStorage.setItem('token', receivedToken)
        user.value = data.user
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        return { success: true, data }
      } else {
        const errorData = await response.json().catch(() => ({}))
        error.value = errorData.message || errorData.errors?.email?.[0] || 'Login failed'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    isLoading.value = true
    error.value = ''

    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      })

      const data = await response.json()

      if (response.ok) {
        // Optionally store token if auto-login (accept `access_token` or `token`)
        const receivedToken = data.access_token ?? data.token ?? ''
        if (receivedToken) {
          token.value = receivedToken
          localStorage.setItem('token', receivedToken)
          user.value = data.user
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user))
          }
        }
        return { success: true, data }
      } else {
        const errorData = await response.json().catch(() => ({}))
        error.value = errorData.message || errorData.errors?.email?.[0] || 'Registration failed'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    if (token.value) {
      try {
        const config = (window as any).config.packages['moii-auth']
        await fetch(`${config.api_url}/logout`, {
          method: 'POST',
          headers: sharedGetAuthHeaders(),
        })
      } catch (err) {
        console.warn('Failed to notify server of logout:', err)
      }
    }
    
    token.value = ''
    user.value = null
    error.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('tempEmail')
    localStorage.removeItem('verificationUuid')
    
  }

  const clearError = () => {
    error.value = ''
  }

  const sendTemporaryCode = async (email: string) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/temporary-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        // Store email and verification UUID for the next step
        localStorage.setItem('tempEmail', email)
        localStorage.setItem('verificationUuid', data.verification_uuid)
        return { success: true, data }
      } else {
        const errorData = await response.json()
        error.value = errorData.message || errorData.errors?.email?.[0] || 'Failed to send verification code'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const verifyTemporaryCode = async (email: string, code: string) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const config = (window as any).config.packages['moii-auth']
      const verificationUuid = localStorage.getItem('verificationUuid')
      
      if (!verificationUuid) {
        throw new Error('Verification session expired. Please request a new code.')
      }

      const response = await fetch(`${config.api_url}/2fa/verify/${verificationUuid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (response.ok) {
        const data = await response.json()
        // Store temporary access token and user data (accept `access_token` or `token`)
        const receivedToken = data.access_token ?? data.token ?? ''
        token.value = receivedToken
        user.value = data.user
        localStorage.setItem('token', receivedToken)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        localStorage.removeItem('tempEmail')
        localStorage.removeItem('verificationUuid')
        
        return { success: true, data }
      } else {
        const errorData = await response.json()
        error.value = errorData.message || errorData.errors?.code?.[0] || 'Verification failed'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const forgotPassword = async (email: string) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, data }
      } else {
        const errorData = await response.json()
        error.value = errorData.message || errorData.errors?.email?.[0] || 'Failed to send reset email'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (token: string, email: string, password: string, password_confirmation: string) => {
    isLoading.value = true
    error.value = ''

    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email, password, password_confirmation }),
      })

      if (response.ok) {
        return { success: true }
      } else {
        const errorData = await response.json()
        error.value = errorData.message || 'Password reset failed'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Session Management Methods
  const getActiveSessions = async () => {
    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/sessions`, {
        method: 'GET',
        headers: sharedGetAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, sessions: data.sessions }
      } else {
        return { success: false, error: 'Failed to fetch sessions' }
      }
    } catch (err) {
      return { success: false, error: 'Network error' }
    }
  }

  const terminateSession = async (sessionUuid: string) => {
    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/sessions/${sessionUuid}`, {
        method: 'DELETE',
        headers: sharedGetAuthHeaders(),
      })

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: 'Failed to terminate session' }
      }
    } catch (err) {
      return { success: false, error: 'Network error' }
    }
  }

  const terminateOtherSessions = async () => {
    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/sessions/terminate-others`, {
        method: 'POST',
        headers: sharedGetAuthHeaders(),
      })

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: 'Failed to terminate other sessions' }
      }
    } catch (err) {
      return { success: false, error: 'Network error' }
    }
  }

  const terminateAllSessions = async () => {
    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/sessions`, {
        method: 'DELETE',
        headers: sharedGetAuthHeaders(),
      })

      if (response.ok) {
        // Clear local session as well
        logout()
        return { success: true }
      } else {
        return { success: false, error: 'Failed to terminate all sessions' }
      }
    } catch (err) {
      return { success: false, error: 'Network error' }
    }
  }

  const verify2FA = async (verification_uuid: string, code: string) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const config = (window as any).config.packages['moii-auth']
      const response = await fetch(`${config.api_url}/2fa/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verification_uuid, code }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user after successful 2FA verification
        token.value = data.access_token
        localStorage.setItem('token', data.access_token)
        user.value = data.user
        return { success: true, data }
      } else {
        error.value = data.message || 'Invalid 2FA code'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = 'Network error'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  return {
    // State
    isLoading,
    error,
    user,
    token,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    sendTemporaryCode,
    verifyTemporaryCode,
    forgotPassword,
    resetPassword,
    verify2FA,
    
    // Session Management
    getActiveSessions,
    terminateSession,
    terminateOtherSessions,
    terminateAllSessions,
    
    // Getters
    isAuthenticated,
  }
})
