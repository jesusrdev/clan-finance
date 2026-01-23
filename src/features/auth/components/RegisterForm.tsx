import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';

export function RegisterForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
  
  const { signUp } = useAuth();
  const router = useRouter();

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('¡Éxito!', 'Revisa tu correo para confirmar tu cuenta');
    } catch (e: any) {
      Alert.alert('Error de registro', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="gap-6 w-full max-w-md">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left font-bold">Crea tu cuenta</CardTitle>
          <CardDescription className="text-center sm:text-left">
            ¡Bienvenido! Completa los detalles para comenzar tu aventura en Clan Finance.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Email */}
            <View className="gap-1.5">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
              />
            </View>
            
            {/* Password */}
            <View className="gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                placeholder="Crea una contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onSubmitEditing={onPasswordSubmitEditing}
                returnKeyType="next"
              />
            </View>

            {/* Confirm Password */}
            <View className="gap-1.5">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                ref={confirmPasswordInputRef}
                id="confirm-password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onSubmitEditing={onSubmit}
                returnKeyType="send"
              />
            </View>

            <Button 
              className="w-full" 
              onPress={onSubmit}
              disabled={loading}
            >
              <Text className="text-primary-foreground font-bold">
                {loading ? 'Creando cuenta...' : 'Continuar'}
              </Text>
            </Button>
          </View>
          <Text className="text-center text-sm text-muted-foreground font-medium">
            ¿Ya tienes una cuenta?{' '}
            <Pressable
              onPress={() => router.push('/login')}>
              <Text className="text-sm font-bold text-primary underline underline-offset-4">Inicia sesión</Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">o regístrate con</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
