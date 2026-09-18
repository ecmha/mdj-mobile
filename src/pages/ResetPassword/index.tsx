import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import MText from '@/components/Text';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { resetPassword } from '@/services/auth';
import { authErrorKey } from '@/services/auth/errors';
import { HttpError } from '@/lib/fetch';
import { PASSWORD_MIN_LENGTH } from '@/lib/validation';
import type { RootStackParamList } from '@/Navigation';
import { fontFamily, mt, textAlign, textDanger, textSmall } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;
type FieldErrors = { password?: string; confirmation?: string };
type Outcome = 'form' | 'done' | 'link_invalid';

// Opened from the reset email's deep link (see usePasswordResetLink). The
// token works once and for 10 minutes; the server checks both.
export default function ResetPassword({ route }: Props) {
  const { t } = useTranslation();
  const theme = useTheme() ?? 'light';
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>('form');

  const handleSubmit = async () => {
    const fieldErrors: FieldErrors = {
      password:
        password.length >= PASSWORD_MIN_LENGTH
          ? undefined
          : t('auth.errors.password_length'),
      confirmation:
        confirmation === password
          ? undefined
          : t('auth.errors.password_mismatch'),
    };
    setErrors(fieldErrors);
    setFormError(null);
    if (fieldErrors.password || fieldErrors.confirmation) return;

    setLoading(true);
    try {
      await resetPassword(route.params.token, password);
      setOutcome('done');
    } catch (error) {
      if (error instanceof HttpError && error.code === 'RESET_TOKEN_INVALID') {
        setOutcome('link_invalid');
      } else {
        setFormError(t(authErrorKey(error)));
      }
    } finally {
      setLoading(false);
    }
  };

  if (outcome !== 'form') {
    const done = outcome === 'done';
    return (
      <AuthLayout title={t('auth.reset_password.title')}>
        <MText
          style={[fontFamily.sfRegular, textSmall, textAlign.center, mt(8)]}
        >
          {done
            ? t('auth.reset_password.done')
            : t('auth.reset_password.link_invalid')}
        </MText>
        <Button
          label={
            done
              ? t('auth.reset_password.go_to_login')
              : t('auth.reset_password.request_new')
          }
          onPress={() => navigation.replace(done ? 'Login' : 'ForgotPassword')}
          style={mt(32)}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.reset_password.title')}>
      <MText style={[fontFamily.sfRegular, textSmall, textAlign.center, mt(8)]}>
        {t('auth.reset_password.description')}
      </MText>
      <FormInput
        label={t('auth.fields.new_password')}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        editable={!loading}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
      />
      <FormInput
        label={t('auth.fields.password_confirmation')}
        value={confirmation}
        onChangeText={setConfirmation}
        error={errors.confirmation}
        editable={!loading}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
      />
      {formError ? (
        <MText style={[textDanger(theme), textAlign.center, mt(16)]}>
          {formError}
        </MText>
      ) : null}
      <Button
        label={t('auth.reset_password.cta')}
        onPress={handleSubmit}
        loading={loading}
        style={mt(24)}
      />
    </AuthLayout>
  );
}
