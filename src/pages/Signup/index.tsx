import { useState } from 'react';
import { Linking } from 'react-native';
import { Trans, useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import MText from '@/components/Text';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { authErrorKey } from '@/services/auth/errors';
import { SignupForm } from '@/services/auth/types';
import { isValidEmail, PASSWORD_MIN_LENGTH } from '@/lib/validation';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/config/app';
import {
  fontFamily,
  mt,
  textAlign,
  textDanger,
  textDecorationLine,
  textMini,
  textPrimary,
  textSmall,
} from '@/theme';

type FieldErrors = Partial<Record<keyof SignupForm, string>>;

export default function Signup() {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const { signup } = useAuth();
  const [form, setForm] = useState<SignupForm>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setField = (field: keyof SignupForm) => (value: string) =>
    setForm(current => ({ ...current, [field]: value }));

  const validate = (): FieldErrors => ({
    firstname: form.firstname.trim() ? undefined : t('auth.errors.firstname'),
    lastname: form.lastname.trim() ? undefined : t('auth.errors.lastname'),
    email: isValidEmail(form.email) ? undefined : t('auth.errors.email'),
    password:
      form.password.length >= PASSWORD_MIN_LENGTH
        ? undefined
        : t('auth.errors.password_length'),
  });

  const handleSignup = async () => {
    const fieldErrors = validate();
    setErrors(fieldErrors);
    setFormError(null);
    setNotice(null);
    if (Object.values(fieldErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const signedIn = await signup({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      if (signedIn) navigation.goBack();
      else setNotice(t('auth.signup.created_pending'));
    } catch (error) {
      setFormError(t(authErrorKey(error)));
    } finally {
      setLoading(false);
    }
  };

  const linkStyle = [textPrimary(theme), textDecorationLine.underline];

  return (
    <AuthLayout
      title={t('auth.signup.title')}
      footer={
        <MText style={[textMini, fontFamily.sfRegular, textAlign.center]}>
          <Trans
            i18nKey="auth.signup.legal"
            components={{
              terms: (
                <MText
                  style={linkStyle}
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(TERMS_OF_USE_URL)}
                />
              ),
              privacy: (
                <MText
                  style={linkStyle}
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
                />
              ),
            }}
          />
        </MText>
      }
    >
      <FormInput
        label={t('auth.fields.firstname')}
        value={form.firstname}
        onChangeText={setField('firstname')}
        error={errors.firstname}
        editable={!loading}
        autoComplete="given-name"
        textContentType="givenName"
      />
      <FormInput
        label={t('auth.fields.lastname')}
        value={form.lastname}
        onChangeText={setField('lastname')}
        error={errors.lastname}
        editable={!loading}
        autoComplete="family-name"
        textContentType="familyName"
      />
      <FormInput
        label={t('auth.fields.email')}
        value={form.email}
        onChangeText={setField('email')}
        error={errors.email}
        editable={!loading}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <FormInput
        label={t('auth.fields.password')}
        value={form.password}
        onChangeText={setField('password')}
        error={errors.password}
        editable={!loading}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSignup}
      />
      {formError ? (
        <MText style={[textDanger(theme), textAlign.center, mt(16)]}>
          {formError}
        </MText>
      ) : null}
      {notice ? (
        <MText style={[textSmall, textAlign.center, mt(16)]}>{notice}</MText>
      ) : null}
      <Button
        label={t('auth.signup.cta')}
        onPress={handleSignup}
        loading={loading}
        style={mt(24)}
      />
    </AuthLayout>
  );
}
