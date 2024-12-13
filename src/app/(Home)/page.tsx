"use client";

export default function Home() {
  return (
    <div className="hero bg-base-300 h-[57vh]">
      <div className="hero-content text-center w-[50vw]">
        <div className="w-full">
          <h1 className="text-5xl font-bold text-primary">
            Welcome to FaceTrack
          </h1>
          <p className="py-6 text-base-lg">
            Revolutionizing attendance management with cutting-edge face
            recognition technology. Seamlessly track attendance and monitor
            student engagement, all through a simple and efficient interface.
            Empower your institution with accurate and reliable data—no more
            manual attendance taking!
          </p>
          <button
            className="btn btn-primary hover:btn-secondary"
            onClick={() => {
              (
                document.getElementById("login") as HTMLDialogElement
              ).showModal();
            }}
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
