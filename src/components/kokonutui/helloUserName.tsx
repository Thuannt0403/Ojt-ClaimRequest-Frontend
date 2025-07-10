import { useAppSelector } from "@/services/store/store";
import React from "react";

const HelloUserName: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex items-center justify-center">
      <div className="relative px-4 py-2 overflow-hidden">
        <h1 className="text-4xl sm:text-3xl font-bold shimmer-text py-2">
          Hello, {user?.fullName || "User"}!
        </h1>
      </div>
      <style>{`
        .shimmer-text {
          --shimmer-color-start: #334155;
          --shimmer-color-mid: #94a3b8;
          background: linear-gradient(
            90deg,
            var(--shimmer-color-start) 0%,
            var(--shimmer-color-start) 40%,
            var(--shimmer-color-mid) 50%,
            var(--shimmer-color-start) 60%,
            var(--shimmer-color-start) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 4s infinite linear;
        }

        @media (prefers-color-scheme: dark) {
          .shimmer-text {
            --shimmer-color-start: #084d9a;
            --shimmer-color-mid: #ea6d22;
          }
        }

        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
};

export default HelloUserName;
