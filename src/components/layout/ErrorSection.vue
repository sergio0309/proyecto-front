<template>
  <section v-if="error?.serverError || error?.validationErrors || error?.credentialsError || error?.unknownError || error?.httpError || error?.networkError || error?.uiError">
    <p v-if="error.uiError"
      class="text-red-500 dark:text-red-400 text-sm mb-2">
      {{ error.uiError }}
    </p>
    <p v-if="error.serverError"
      class="text-red-500 dark:text-red-400 text-sm mb-2">
      {{ error.serverError }}
    </p>

    <p v-if="error.credentialsError"
      class="text-red-500 dark:text-red-400 text-sm mb-2">
      {{ error.credentialsError }}
    </p>

    <p v-if="error.unknownError"
      class="text-red-500 dark:text-red-400 text-sm mb-2">
      {{ error.unknownError }} UNKNOWN. please try again or later.
    </p>

    <p v-if="error.httpError"
      class="text-red-500 dark:text-red-400 text-sm mb-2">
      {{ error.httpError }} HTTP. please try again or later.
    </p>

    <p v-if="error.networkError"
      class="text-red-500 dark:text-red-400 text-sm mb-2">
      {{ error.networkError }} Network. please try again or later.
    </p>

    <!-- Errores de validación -->
    <ul v-if="error.validationErrors" class="text-red-500 dark:text-red-400 text-sm">
      {{ error.validationErrors }}
      <li v-for="(msg, field) in error.validationErrors" :key="field">
        {{ Array.isArray(msg) ? msg.join(', ') : msg }}
      </li>
    </ul>
  </section>
</template>


<script setup>
defineProps({ error: Object })
</script>