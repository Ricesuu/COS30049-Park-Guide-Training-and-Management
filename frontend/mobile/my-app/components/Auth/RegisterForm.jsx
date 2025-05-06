import { useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import TextInputField from "./TextInputField";
import PasswordInputField from "./PasswordInputField";
import AnimatedButton from "../AnimatedButton";
import Recaptcha from "react-native-recaptcha-that-works";
import { useRegisterHandler } from "../../hooks/useRegisterHandler"; // Adjust path as needed

export default function RegisterForm({ onSubmit }) {
  const router = useRouter();
  const navigateTo = (path) => router.push(path);

  const { validateForm } = useRegisterHandler();

  const [role] = useState("park_guide");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [errors, setErrors] = useState({});

  const recaptchaRef = useRef();

  const handleFormSubmit = () => {
    recaptchaRef.current.open(); // open reCAPTCHA dialog first
  };

  const handleRecaptchaVerify = (token) => {
    setRecaptchaToken(token);

    const form = {
      role,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      recaptchaToken: token,
    };

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(form);
  };

  return (
    <View className="flex-1 bg-white px-6 pt-8 pb-16 rounded-t-3xl -mt-10">
      <Text className="text-3xl font-bold text-center text-black p-3">
        Create An Account
      </Text>
      <Text className="text-sm text-center text-gray-700 mb-4">
        This registration form is for{" "}
        <Text className="font-bold text-gray-700">Park Guides</Text> only.
      </Text>

      {/* First Name */}
      <TextInputField placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      {errors?.firstName && <Text className="text-red-500 text-xs mb-2">{errors.firstName}</Text>}

      {/* Last Name */}
      <TextInputField placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      {errors?.lastName && <Text className="text-red-500 text-xs mb-2">{errors.lastName}</Text>}

      {/* Email */}
      <TextInputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors?.email && <Text className="text-red-500 text-xs mb-2">{errors.email}</Text>}

      {/* Password */}
      <PasswordInputField placeholder="Password" value={password} onChangeText={setPassword} />
      <Text className="w-full text-xs text-gray-500 mb-1">
        Use 8 or more characters with a mix of letters, numbers & symbols.
      </Text>
      {errors?.password && <Text className="text-red-500 text-xs mb-2">{errors.password}</Text>}

      {/* Confirm Password */}
      <PasswordInputField
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errors?.confirmPassword && (
        <Text className="text-red-500 text-xs mb-2">{errors.confirmPassword}</Text>
      )}

      {/* reCAPTCHA */}
      <View className="my-4">
        <Recaptcha
          ref={recaptchaRef}
          siteKey="6Le2oyorAAAAALJWeK7PF4Uu6EEyRAT7GhY2SgFx"
          baseUrl="http://localhost"
          size="normal"
          onVerify={handleRecaptchaVerify}
          onExpire={() => {
            setRecaptchaToken(null);
            setErrors((prev) => ({
              ...prev,
              recaptcha: "reCAPTCHA expired. Please try again.",
            }));
          }}
        />
        {errors?.recaptcha && (
          <Text className="text-red-500 text-xs mt-2">{errors.recaptcha}</Text>
        )}
      </View>

      {/* Create Account Button */}
      <AnimatedButton
        label="Create Account"
        onPress={handleFormSubmit}
        className="bg-green-600 mb-4"
      />

      {/* Login Prompt */}
      <View className="flex-row justify-center mt-4">
        <Text className="text-black">Already have an account? </Text>
        <TouchableOpacity onPress={() => navigateTo("/")}>
          <Text className="font-bold text-green-600 underline">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}