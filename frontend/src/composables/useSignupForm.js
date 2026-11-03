import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { registerUser } from "@/services/authService";
import { rules } from "@/utils/validators";

export function useSignupForm({ onSuccess } = {}) {
  const router = useRouter()

  const form = reactive({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "creator",
  });
  const formRef = ref(null);
  const loading = ref(false);
  const error = ref("");
  const showPassword = ref(false);

  watch(
    () => form.password,
    () => {
      if (form.password) formRef.value?.validate();
      if (form.confirmPassword) formRef.value?.validate();
    },
  );

  const fieldRules = {
    fullName: [rules.required("Full name")],
    email: [rules.required("Email"), rules.email],
    password: [rules.required("Password"), rules.minLength(8)],
    confirmPassword: [
      rules.required("Confirm Password"),
      rules.confirmPassword(() => form.password),
    ],
  };

  async function submit() {
    error.value = "";
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;
    try {
      const user = await registerUser({ ...form });
      onSuccess?.(user);
      router.replace('/home');
    } catch (err) {
      // BACKEND: err.fields holds per-field errors from a 400 response (e.g. duplicate email).
      // Map them onto the inputs here if you want field-level messages instead of one banner.
      error.value = err.message || "Something went wrong. Try again.";
    } finally {
      loading.value = false;
    }
  }

  return { form, formRef, loading, error, showPassword, fieldRules, submit };
}
