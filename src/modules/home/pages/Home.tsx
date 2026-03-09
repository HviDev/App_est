import { useEffect } from "react";
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useBoilerStore } from "@/modules/home/store/boiler.store";

export default function Home() {
  const { userData, loading: authLoading } = useAuthStore(state => state);
  const { boilers, loading: boilersLoading, error, fetchBoilers, joinBoiler, leaveBoiler, turnOffBoiler, subscribeToBoilers } = useBoilerStore();

 useEffect(() => {
  fetchBoilers();
  const unsubscribe = subscribeToBoilers();

  return () => {
    unsubscribe(); // Ahora solo se ejecutará cuando el componente se destruya de verdad
  };
}, []); // Array vacío: Solo se ejecuta al montar el componente
  if (authLoading || boilersLoading) return <p>Cargando...</p>;
  if (!userData) return <Badge variant="destructive">Contacta con el administrador para completar tu registro</Badge>;
  if (error) return <p>Error: {error}</p>;

  const myBoilers = boilers.filter(boiler => 
  boiler.$id.includes(userData.boilers)
);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {myBoilers.map(boiler => {
        const status = boiler.boilerStatus;
        const isOwner = status?.ownerData?.$id === userData.$id;
        const isActiveUser = status?.activeUsers?.some(u => u.userId === userData.userId);
        const isLastUser = (status?.activeUsers?.length ?? 0) === 1;

        return (
          <Card key={boiler.$id}>
            <CardHeader>
              <CardTitle>{boiler.name}</CardTitle>
              <CardDescription>Este boiler es para las hab. {boiler.rooms.join(", ")}</CardDescription>
              <CardAction>
                {!status && <Badge variant="secondary">Sin estado</Badge>}
                {status?.state === "ENCENDIDO" && <Badge className="bg-green-100 text-green-700">Encendido</Badge>}
                {status?.state === "APAGADO" && <Badge variant="destructive">Apagado</Badge>}
                {status?.state === "PILOTO" && <Badge className="bg-yellow-100 text-yellow-700">Piloto</Badge>}
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Zona: {boiler.zone}</span>

              {status && (
                <div className="text-sm text-muted-foreground flex flex-col gap-1">
                  {status.activeUsers?.length > 0 && (
                    <span className="text-green-300 font-large">
                      En uso por: {status.activeUsers.map(u => u.userRoom || "Cargando...").join(", ")}
                    </span>
                  )}
                  {status.ownerData && isLastUser && isActiveUser &&(
                    <span className="text-orange-300 font-medium">⚠️ Eres el último, debes ponerlo en piloto.</span>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 md:flex-row">
              {/* ENCENDER */}
              {status?.state !== "ENCENDIDO" && (
                <Button className="w-full md:w-auto" onClick={() => joinBoiler(boiler.$id, userData)}>Encender Boiler</Button>
              )}

              {/* NO OWNER → Unirse */}
              {status?.state === "ENCENDIDO" && !isOwner && !isActiveUser && (
                <Button variant="secondary" className="w-full md:w-auto" onClick={() => joinBoiler(boiler.$id, userData)}>Unirme al boiler</Button>
              )}

              {/* YA ESTÁS DENTRO → Salir */}
              {status?.state === "ENCENDIDO" && isActiveUser && !isLastUser && (
                <Button variant="secondary" className="w-full md:w-auto" onClick={() => leaveBoiler(boiler.$id, userData)}>Dejar de usar</Button>
              )}

              {status?.state === "ENCENDIDO" && isLastUser && isActiveUser &&(
                <Button variant="warning" className="w-full md:w-auto" onClick={() => leaveBoiler(boiler.$id, userData)}>Poner en piloto</Button>
              )
              }

              {/* Todos pueden apagar */}
              {status?.state === "ENCENDIDO" && isActiveUser && (
                <Button variant="destructive" className="w-full md:w-auto" onClick={() => turnOffBoiler(boiler.$id, userData)}>Apagar</Button>
              )}
            </CardFooter>
          </Card>
          
        );
      })}
    </div>
  );
}
