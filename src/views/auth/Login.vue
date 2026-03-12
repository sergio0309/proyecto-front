<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F3DCA3]">
    <div class="w-full max-w-2xl p-6">
      <div class="mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden" style="border-radius: 24px;">
        <!-- Header -->
        <div class="px-8 py-10 text-center">
          <img src="/images/favicon.png" class="max-w-48 text-center mx-auto rounded-2xl" />
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-surface-0 mb-1">Bienvenido</h1>
          <p class="text-sm text-slate-500 dark:text-slate-300">Ingresa tus credenciales para continuar</p>
        </div>

        <div class="px-8 pb-10">
          <!-- Loading (global minimal) -->
          <div v-if="authStore.loading" class="mb-4 text-center text-slate-600">Cargando...</div>

          <!-- Error area (aria-live for assistive tech) -->
          <div aria-live="polite" class="mb-4">
            <ErrorSection :error="errorStore.error" />
          </div>

          <!-- FORM: sólo UNO -->
          <form @submit.prevent.stop="handleLogin" novalidate class="space-y-4" autocomplete="on" aria-describedby="auth-help">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
              <input
                id="email"
                name="email"
                ref="emailRef"
                type="email"
                autocomplete="email"
                class="w-full md:w-xl px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-60"
                :class="emailError ? 'border-red-400' : 'border-gray-200'"
                v-model="email"
                required
                :aria-invalid="!!emailError"
                aria-describedby="email-error"
              />
              <p v-if="emailError" id="email-error" class="text-sm text-red-500 mt-1">{{ emailError }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Contraseña</label>
              <div class="relative">
                <input
                  id="password"
                  name="password"
                  ref="passwordRef"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  class="w-full md:w-[36rem] px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-opacity-60"
                  :class="passwordError ? 'border-red-400' : 'border-gray-200'"
                  v-model="password"
                  required
                />
                <!-- Toggle -->
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded"
                  @click="showPassword = !showPassword"
                  :aria-pressed="showPassword"
                >
                  {{ showPassword ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
              <p v-if="passwordError" class="text-sm text-red-500 mt-1">{{ passwordError }}</p>
            </div>

            <!-- Help / forgot -->
            <div class="flex items-center justify-between text-sm">
              <a href="#" class="text-gray-600 hover:text-gray-400">¿Olvidaste tu contraseña?</a>
              <span class="text-slate-500 text-xs">¿No tienes cuenta? <a href="#" class="text-primary-600 hover:underline">Crear</a></span>
            </div>

            <!-- Submit -->
            <div>
              <button
                type="submit"
                :disabled="authStore.loading"
                class="w-full py-3 rounded-lg text-black font-medium transition-colors bg-[#F3DCA3]"
                :aria-busy="String(authStore.loading)"
              >
                <span v-if="authStore.loading" class="inline-flex items-center gap-2 justify-center">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-opacity="0.2"/></svg>
                  Iniciando...
                </span>
                <span v-else>Entrar</span>
              </button>
            </div>

            <p id="auth-help" class="text-xs text-slate-500 mt-2">Al ingresar aceptas los <a class="underline" href="#">términos</a>.</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/useAuth';
import { useErrorStore } from '../../store/useError';
import ErrorSection from '../../components/layout/ErrorSection.vue';

const authStore = useAuthStore();
const errorStore = useErrorStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const emailRef = ref(null);
const passwordRef = ref(null);

// computed errors local (UI-friendly)
const emailError = computed(() => errorStore.error?.validationErrors?.email?.[0] || (errorStore.error?.uiError && null));
const passwordError = computed(() => errorStore.error?.validationErrors?.password?.[0] || null);

const focusFirstError = () => {
  // If there are validation errors, focus the first field
  if (errorStore.error?.validationErrors) {
    if (errorStore.error.validationErrors.email) {
      emailRef.value?.focus();
      return;
    }
    if (errorStore.error.validationErrors.password) {
      passwordRef.value?.focus();
      return;
    }
  }
};

const handleLogin = async (e) => {
  // defensive: stop propagation, though form has .stop already
  e?.stopPropagation?.();
  errorStore.resetError();

  if (!email.value.trim()) {
    errorStore.setUiError('El email es obligatorio');
    emailRef.value?.focus();
    return;
  }
  if (!password.value.trim()) {
    errorStore.setUiError('La contraseña es obligatoria');
    passwordRef.value?.focus();
    return;
  }

  try {
    // Asegúrate de que authStore.login acepte un objeto { email, password }.
    await authStore.login({ 
      email: email.value.trim(),
      password: password.value 
    });

    if (authStore.user) {
      router.push({ name: 'perfil' });
    }
  } catch (err) {
    // Manejo centralizado + foco en el campo fallado si aplica
    errorStore.handleError(err);
    focusFirstError();
  }
};
</script>