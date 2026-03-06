import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/modules/home/store/auth.store"
import {  useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"



export default function SignupForm() {
  const { register, loading, error, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const confirmPasswordRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (user) {
        // Si 'from' existe es un string, si no, vamos a "/"
        const destination = location.state?.from || "/";
        navigate(destination, { replace: true });
      }
    }, [user, navigate, location]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault(); 
    setLocalError("");

    // Verificación de coincidencia
    if (password !== confirmPassword) {
      setLocalError("Las contraseñas no coinciden");
      setConfirmPassword("");
      confirmPasswordRef.current?.focus();
      return;
    }

    // Si todo está bien, llamamos al store
    register(email, password, userName);
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Crea una cuenta</CardTitle>
          <CardDescription>
            Ingresa la información necesaria para crear tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input
                  id="name"
                  type="text" placeholder="Juan Herrera"
                  autoComplete="username"
                  value={userName}
                  required
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Correo electronico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@ejemplo.com"
                  autoComplete="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldDescription>
                  Se usara para iniciar sesión.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
                <FieldDescription>
                  Debe tener al menos 8 caracteres de largo.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirmar contraseña
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="confirm-password"
                  ref={confirmPasswordRef}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required />
                <FieldDescription>Por favor confirma la contraseña.</FieldDescription>
              </Field>
              {(localError || error) && (
                <p className="text-sm font-medium text-red-500 text-center animate-in fade-in slide-in-from-top-1">
                  {localError || error}
                </p>
              )}
              <FieldGroup>
                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Cargando..." : "Crear cuenta"}
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    ¿Ya tienes una cuenta? <a href="/login">iniciar sesión</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

