import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import MText from '@/components/Text';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { requestPasswordReset } from '@/services/auth';
import { authErrorKey } from '@/services/auth/errors';
import { isValidEmail } from '@/lib/validation';
import type { RootStackParamList } from '@/Navigation';
import { fontFamily, mt, textAlign, textDanger, textSmall } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

// Emails a reset link. The server answers the same way whether or not the
// account exists, so the confirmation never says whether it does.
export default function ForgotPassword({ route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setFormError(null);
    if (!isValidEmail(email)) {
      setEmailError(t('auth.errors.email'));
      return;
    }
    setEmailError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (error) {
      setFormError(t(authErrorKey(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.forgot_password.title')}>
      <MText style={[fontFamily.sfRegular, textSmall, textAlign.center, mt(8)]}>
        {sent
          ? t('auth.forgot_password.sent')
          : t('auth.forgot_password.description')}
      </MText>
      {sent ? (
        <Button
          label={t('auth.forgot_password.back_to_login')}
          variant="outline"
          onPress={() => navigation.goBack()}
          style={mt(32)}
        />
      ) : (
        <>
          <FormInput
            label={t('auth.fields.email')}
            value={email}
            onChangeText={setEmail}
            error={emailError}
            editable={!loading}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          {formError ? (
            <MText style={[textDanger(theme), textAlign.center, mt(16)]}>
              {formError}
            </MText>
          ) : null}
          <Button
            label={t('auth.forgot_password.cta')}
            onPress={handleSend}
            loading={loading}
            style={mt(24)}
          />
        </>
      )}
    </AuthLayout>
  );
}
