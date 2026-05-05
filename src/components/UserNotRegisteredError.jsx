import React from 'react';

export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-destructive mb-4">Acesso Negado</h1>
      <p className="text-muted-foreground">Você não está registrado neste sistema do Karate Dashboard.</p>
    </div>
  );
}