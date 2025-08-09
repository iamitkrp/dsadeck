export default function GlobalBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black 50%, transparent 75%)",
          maskImage: "radial-gradient(ellipse at top, black 50%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none fixed inset-x-0 top-[-120px] -z-10 mx-auto h-[380px] w-[900px] rounded-full bg-gradient-to-br from-primary/25 via-fuchsia-400/20 to-cyan-400/20 blur-3xl opacity-50" aria-hidden />
    </>
  );
}


