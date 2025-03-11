"use server";

export async function verificarSessao(refreshToken: string) {
  try {
    const response = await fetch("http://localhost:8002/verificar_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    }).then<{ access_token: string | undefined; erro: boolean }>(
      async (res) => await res.json()
    );

    return response;
  } catch (e) {
    console.error(e);
    return { erro: true, access_token: undefined };
  }
}
