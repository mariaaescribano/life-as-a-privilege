import React from "react";

// ─────────────────────────────────────────────────────────────────────────
// ErrorBoundary — red de seguridad global. Sin ella, cualquier excepción
// lanzada durante el render (p. ej. datos guardados con una forma antigua que
// rompen un .map) desmonta TODO el árbol de React y deja una pantalla en blanco
// irrecuperable. Aquí la capturamos y mostramos un aviso con opción de recargar,
// para que un fallo puntual nunca deje al usuario ante una pantalla vacía.
// ─────────────────────────────────────────────────────────────────────────
interface Props { children: React.ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Deja rastro en consola para depurar (no rompe la app).
    console.error("[ErrorBoundary] Render error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "24px",
          textAlign: "center",
          background: "#008080",
          color: "#ffffff",
          fontFamily: "'EB Garamond', serif",
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "0.04em" }}>
          Algo se ha torcido por un momento
        </div>
        <div style={{ fontSize: "16px", opacity: 0.9, maxWidth: "460px", lineHeight: 1.6 }}>
          No te preocupes: tus datos están guardados. Vuelve a cargar la página para continuar.
        </div>
        <button
          onClick={this.handleReload}
          style={{
            marginTop: "8px",
            padding: "10px 26px",
            borderRadius: "9999px",
            border: "1.5px solid rgba(255,255,255,0.85)",
            background: "rgba(255,255,255,0.12)",
            color: "#ffffff",
            fontFamily: "'EB Garamond', serif",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.06em",
            cursor: "pointer",
          }}
        >
          Recargar
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
