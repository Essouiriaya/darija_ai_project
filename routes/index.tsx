import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/darija/login.html");
    window.location.replace("/darija/home.html");
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white"></div>

function PlaceholderIndex() {
function Index() {
  useEffect(() => {
    window.location.replace("/darija/login.html");
  }, []);
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#fcfbf8" }}
    >
      <img
        data-lovable-blank-page-placeholder="REMOVE_THIS"
        src="https://cdn.gpteng.co/blank-app-v1.svg"
        alt="Your app will live here!"
      />
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p>Loading Darija AI...</p>
    </div>
  );
}
function Index() {
  return <PlaceholderIndex />;
}
