import { Box, Button, Center, Field, Heading, Input, Stack, Text } from '@chakra-ui/react'

export function LoginForm({ onSubmit, cargando, error }) {
  return (
    <Center minH="100vh" px="4">
      <Box
        as="form"
        onSubmit={onSubmit}
        w="full"
        maxW="sm"
        bg="bg"
        p="8"
        borderRadius="2xl"
        boxShadow="2xl"
      >
        <Stack gap="6">
          <Stack gap="1" textAlign="center">
            <Heading size="2xl">Bienvenido</Heading>
            <Text color="fg.muted" fontSize="sm">
              Ingresa tus credenciales para continuar
            </Text>
          </Stack>

          <Stack gap="4">
            <Field.Root required>
              <Field.Label>
                Usuario <Field.RequiredIndicator />
              </Field.Label>
              <Input name="usuario" placeholder="Tu usuario" autoComplete="username" />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Clave <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="clave"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field.Root>
          </Stack>

          {error && (
            <Text color="fg.error" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <Button type="submit" colorPalette="blue" size="lg" w="full" loading={cargando}>
            Ingresar
          </Button>
        </Stack>
      </Box>
    </Center>
  )
}
