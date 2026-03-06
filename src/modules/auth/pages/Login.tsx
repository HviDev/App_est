import { useState, useEffect } from "react"
import { useAuthStore } from "@/modules/home/store/auth.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, user } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (user) {
      // Si 'from' existe es un string, si no, vamos a "/"
      const destination = location.state?.from || "/";
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location]);

  return (
    // Este DIV es el fondo que centra todo
    <div className="min-h-screen flex items-center justify-center p-4">

      {/* La CARD ahora es el contenedor del formulario */}
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Ingresa a tu cuenta</CardTitle>
          <CardDescription>
            Completa los datos para ingresar a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@ejemplo.com"
                  autoComplete="username"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)} />

                {error && (
                  <p className="text-sm text-red-500 text-center font-medium">
                    {error}
                  </p>
                )}
              </Field>

            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field>
            <form onSubmit={(e) => {
              e.preventDefault();
              login(email, password);
            }}>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <FieldDescription className="text-center">
              ¿Aún no tienes una cuenta? <a href="/signup">Registrarme</a>
            </FieldDescription>
          </Field>

        </CardFooter>
      </Card>
    </div>
  );
}