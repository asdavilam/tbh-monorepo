/**
 * Renders a centered, responsive landing-style page with a prominent heading and a subtitle.
 *
 * @returns The page as a JSX element.
 */
export function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: 'white',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
        }}
      >
        TBH
      </h1>
      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          color: '#9ca3af',
          fontWeight: 400,
        }}
      >
        En construcción
      </p>
    </main>
  );
}
