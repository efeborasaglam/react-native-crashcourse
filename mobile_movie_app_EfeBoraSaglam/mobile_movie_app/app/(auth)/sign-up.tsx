import * as React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setPendingVerification(true);
    } catch (err: any) {
      const message = err.errors?.[0]?.message || 'Something went wrong';
      setError(message);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

const onVerifyPress = async () => {
  if (!isLoaded) return


  try {
    // Use the code the user provided to attempt verification
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code,
    })

    // If verification was completed, set the session to active
    // and redirect the user
    if (signUpAttempt.status === 'complete') {
      await setActive({ session: signUpAttempt.createdSessionId })
      router.replace('/')
    } else {
      // If the status is not complete, check why. User may need to
      // complete further steps.
      console.error(JSON.stringify(signUpAttempt, null, 2))
    }
  } catch (err) {
    // See https://clerk.com/docs/custom-flows/error-handling
    // for more info on error handling
    console.error(JSON.stringify(err, null, 2))
  }
}
return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
    >
        <View style={styles.innerContainer}>
            {pendingVerification ? (
                <>
                    <Text style={styles.title}>Verify your email</Text>
                    <TextInput
                        style={styles.input}
                        value={code}
                        placeholder="Verification code"
                        keyboardType="number-pad"
                        onChangeText={setCode}
                    />
                    {error !== '' && <Text style={styles.errorText}>{error}</Text>}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onVerifyPress}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Sign Up</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoComplete="email"
                        value={emailAddress}
                        placeholder="Email"
                        onChangeText={setEmailAddress}
                    />
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        textContentType="password"
                        autoComplete="password"
                        value={password}
                        placeholder="Password"
                        onChangeText={setPassword}
                    />
                    
                    {/* CAPTCHA Element hier einfügen */}
                    <div id="clerk-captcha"></div>

                    {error !== '' && <Text style={styles.errorText}>{error}</Text>}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSignUpPress}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
                    </TouchableOpacity>

                    <View style={styles.linkContainer}>
                        <Text>Already have an account?</Text>
                        <Link href="/sign-in">
                            <Text style={styles.link}> Sign In</Text>
                        </Link>
                    </View>
                </>
            )}
        </View>
    </KeyboardAvoidingView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e40af',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: '#1e40af',
    fontWeight: '500',
  },
});
