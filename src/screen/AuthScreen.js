import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { auth } from '../../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
    } catch (e) {
      Alert.alert('Sign-in failed', e.message);
    }
  };

  const signUp = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email.trim(), password);
    } catch (e) {
      Alert.alert('Sign-up failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          paddingTop: 30,
          fontsize: 30,
          color: '#000',
          letterSpacing: 1,
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Welcome to TODO app{' '}
      </Text>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.alt]} onPress={signUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  alt: { backgroundColor: '#059669' },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ghostText: { color: '#000' },
});
