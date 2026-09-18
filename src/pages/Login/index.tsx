import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import MText from '@/components/Text';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { authErrorKey } from '@/services/auth/errors';
import { isValidEmail } from '@/lib/validation';
import {
  alignSelf,
  fontFamily,
  mt,
  p,
  textAlign,
  textDanger,
  textPrimary,
  textSmall,
} from '@/theme';

type FieldErrors = { email?: string; password?: string };

export default function Login() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const fieldErrors: FieldErrors = {
      email: isValidEmail(email) ? undefined : t('auth.errors.email'),
      password: password ? undefined : t('auth.errors.password_required'),
    };
    setErrors(fieldErrors);
    setFormError(null);
    if (fieldErrors.email || fieldErrors.password) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigation.goBack();
    } catch (error) {
      setFormError(t(authErrorKey(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.login.title')}>
      <FormInput
        label={t('auth.fields.email')}
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        editable={!loading}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <FormInput
        label={t('auth.fields.password')}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        editable={!loading}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleLogin}
      />
      <TouchableOpacity
        style={[alignSelf.end, p(8), mt(4)]}
        // Carries over the email typed so far.
        onPress={() =>
          navigation.navigate('ForgotPassword', { email: email.trim() })
        }
        disabled={loading}
        accessibilityRole="link"
      >
        <MText style={[textSmall, fontFamily.sfRegular, textPrimary(theme)]}>
          {t('auth.login.forgot_password')}
        </MText>
      </TouchableOpacity>
      {formError ? (
        <MText style={[textDanger(theme), textAlign.center, mt(8)]}>
          {formError}
        </MText>
      ) : null}
      <Button
        label={t('auth.login.cta')}
        onPress={handleLogin}
        loading={loading}
        style={mt(24)}
      />
    </AuthLayout>
  );
}
